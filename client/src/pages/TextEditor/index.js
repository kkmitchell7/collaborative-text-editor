import React, { useCallback, useEffect, useState } from 'react'
import Quill from 'quill'
import './styles.css'
import "quill/dist/quill.snow.css"
import {io} from 'socket.io-client'
import { useParams} from 'react-router-dom'

const SAVE_INTERVAL_MS = 2000 //Dictates how often the document data is saved, 2 seconds
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
  ]

export default function TextEditor() {
    const {id: documentId} = useParams() //Id of the current document
    const [socket, setSocket] = useState() //Current instance of socket.io
    const [quill, setQuill] = useState() //Current instance of quill
    const [error, setError] = useState(null); 
    
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const userId = JSON.parse(localStorage.getItem('userId'));
    const token = localStorage.getItem('token');

    /**
     * Opens and cleans up web socket connection
     */
    useEffect(()=>{
    
        
        const s = io(backendUrl) //connection
        setSocket(s)

        return ()=>{ //Cleanup, disconnect web socket when component unmounts
            s.disconnect()
        }
        

    },[backendUrl])
    
    /**
     * Load the current document using the documentId
     */

    useEffect(()=>{
        if (socket == null || quill == null ) return
        
        socket.once("load-document",document =>{ //Listens for load-document once, then cleans up listener
            quill.setContents(document)
            quill.enable() //Enable quill since we've loaded the document
        })

        socket.on("error", (error) => {
            console.error("Error received from server:", error);
            setError(error.message); 
        });

        socket.emit('get-document',{documentId,userId})


    },[socket,quill,documentId])

    

    /**
     * Save the current document data
     */
    useEffect(()=>{
        if (socket == null || quill == null) return
        const interval = setInterval(()=>{
            socket.emit('save-document',quill.getContents())
        }, SAVE_INTERVAL_MS)

        return ()=>{
            clearInterval(interval)
        }

    },[socket,quill])

    /**
     * Recieves text changes from the server
     */
    useEffect(()=>{
        if (socket== null || quill == null) return

        const handler = (delta)=>{ //Delta is quill specific, represents changes made in the editor via small operations
            quill.updateContents(delta) //When recieve changes from server, use quill to update
        }

        socket.on('recieve-changes', handler) //Event listener, recieve changes from the server

        return ()=>{ //Cleanup, turn off event listener when component unmounts
            socket.off('recieve-changes',handler)
        }
    },[socket,quill])

    /**
     * Sends text changes from this instance to the server
     */
    useEffect(()=>{
        if (socket== null || quill == null) return

        const handler = (delta,oldDelta,source)=>{ //Delta is quill specific, represents changes made in the editor via small operations
            if (source !== 'user') return //Only want to transmit changes made by the user
            socket.emit('send-changes', delta) //Send the deltas to the server
        }

        quill.on('text-change', handler) //Event listener, when changes in text, transmit to the socket

        return ()=>{ //Cleanup, turn off event listener when component unmounts
            quill.off('text-change',handler)
        }
    },[socket,quill])
    
    /**
     * Creates quill object, prevents duplication of quill element upon rerender
     */
    const wrapperRef = useCallback((wrapper)=>{ //wrapper is div object, useCallback invoked with the DOM element attached/detached from component
        if (wrapper == null) return
        
        wrapper.innerHTML = '' //reset the div
        const editor = document.createElement('div') //create new div
        wrapper.append(editor) //append new div to wrapper
        
        const q = new Quill(editor,{ theme: 'snow', modules: {toolbar: TOOLBAR_OPTIONS}}); //create Quill instance in new div
        q.disable() //Disable quill until we load the current document from the server
        q.setText('Loading...')
        setQuill(q)

    },[])

    if (error) {
        return <p>{error}</p>;  // Show error message if there's an error
    } else {
        return (
            <div className="container" ref={wrapperRef}></div>  //once mounted in the DOM, react passes div to wrapperRef function
        );
    }

}
