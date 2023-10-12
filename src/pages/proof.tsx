import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ThemeConsumer } from "styled-components";


/**
 * 冒険の証
 */
export default function Proof() {
    const gameDetailCollectionName = "game_detail";
    type ProofType = {title: string, id:string}
    const [proofs, setProofs] = useState<ProofType[]>([]);
    useEffect(() => {
        getDocs(collection(db, gameDetailCollectionName))
            .then(docs => {console.log(docs);return docs})
            .then(docs => docs.docs)
            .then(docs => docs.map(doc => ({title:doc.data().Prologue, id: doc.id as string}) as ProofType))
            .then(setProofs)
            .catch(console.log)
    }, [])
    return <>{proofs.map(proof => <p>{proof.title}#{proof.id}</p>)}</>
}