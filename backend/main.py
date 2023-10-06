from flask import Flask, request, Response
import torch
from diffusers import StableDiffusionPipeline, StableDiffusionXLPipeline
from io import BytesIO
from firebase_admin import credentials,initialize_app, storage
import time

app = Flask(__name__)

# pipe_chara = StableDiffusionPipeline.from_single_file("./anythingV5Anything_anythingV5PrtRE.safetensors")
# pipe_chara = pipe_chara.to("cuda")
# # nsfwチェッカーを無効化
# def null_safety(image, device, dtype):
#     return image, None
# pipe_chara.run_safety_checker = null_safety

pipe_background = StableDiffusionXLPipeline.from_pretrained("stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, variant="fp16", use_safetensors=True)
pipe_background.to("cuda")

cred = credentials.Certificate(r"ishikawa-procon-firebase-adminsdk-xrl8i-268be49589.json")
initialize_app(cred)
bucket = storage.bucket("ishikawa-procon.appspot.com")

# pipe_background.run_safety_checker = null_safety

@app.route("/" ,methods=['GET'])
def root():
	prompt    = request.args.get("prompt", type=str)
	if prompt is None:
		return "specify prompt parameter", 400
	width     = request.args.get("width", default=768, type=int)
	height    = request.args.get("height", default=512, type=int)
	seed      = request.args.get("seed", default=0, type=int)
	generator = torch.Generator("cuda").manual_seed(seed)

	image = pipe_background(prompt, guidance_scale=7.5, width=width, height=height).images[0]
	image.save("output.jpg")

	# 画像をbase64に変換
	jpeg_data = BytesIO()
	image.save(jpeg_data, format='JPEG')

	# 画像をfirebaseに保存
	blob = bucket.blob("images/" + str(time.time()) + ".jpg")
	blob.upload_from_string(jpeg_data.getvalue(), content_type="image/jpeg")
	blob.make_public()

	torch.cuda.empty_cache()

	response = Response(blob.public_url)
	response.headers["Access-Control-Allow-Origin"] = "*"
	print("prompt: " + prompt + " image:" + blob.public_url)

	return response

@app.route("/chara" ,methods=['GET'])
def chara():
	return None, 403 # 一時的に無効化
	prompt = request.args['prompt']
	generator = torch.Generator("cuda").manual_seed(0)

	with torch.autocast("cuda"):
		image = pipe_chara(prompt, guidance_scale=7.5, generator=generator, width=512, height=512).images[0]

	image.save("output.jpg")

	# 画像をbase64に変換
	jpeg_data = BytesIO()
	image.save(jpeg_data, format='JPEG')

	# 画像をfirebaseに保存
	blob = bucket.blob("images/" + str(time.time()) + ".jpg")
	blob.upload_from_string(jpeg_data.getvalue(), content_type="image/jpeg")
	blob.make_public()

	torch.cuda.empty_cache()

	return blob.public_url

app.run(host='0.0.0.0', port=5000, debug=True)