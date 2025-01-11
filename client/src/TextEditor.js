import React, { useCallback, useEffect, useState } from 'react'
import Quill from 'quill'
import './styles.css'
import "quill/dist/quill.snow.css"
import {io} from 'socket.io-client'
import { useParams} from 'react-router-dom'

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
    const {id: documentId} = useParams()
    const [socket, setSocket] = useState()
    const [quill, setQuill] = useState()
    

    /**
     * Opens and cleans up web socket connection
     */
    useEffect(()=>{
        const s = io("http://localhost:3001") //connection
        setSocket(s)

        return ()=>{ //Cleanup, disconnect web socket when component unmounts
            s.disconnect()
        }
    },[])
    
    useEffect(()=>{


    },[socket,quill,documentId])



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
     * Prevents duplication of quill element upon rerender
     */
    const wrapperRef = useCallback((wrapper)=>{ //wrapper is div object, useCallback invoked with the DOM element attached/detached from component
        if (wrapper == null) return
        wrapper.innerHTML = '' //reset the div
        const editor = document.createElement('div') //create new div
        wrapper.append(editor) //append new div to wrapper
        const q = new Quill(editor,{ theme: 'snow', modules: {toolbar: TOOLBAR_OPTIONS}}); //create Quill instance in new div
        setQuill(q)

    },[]) //stable function across renders
    
    return (
    <div className="container" ref={wrapperRef}></div> //once mounted in the DOM, react passes div to wrapperRef function
    );
}
