import React, { useCallback } from 'react'
import Quill from 'quill'
import './styles.css'
import "quill/dist/quill.snow.css"

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
    //Prevents duplication of quill element upon rerender
    const wrapperRef = useCallback((wrapper)=>{ //wrapper is div object, useCallback invoked with the DOM element attached/detached from component
        if (wrapper == null) return
        wrapper.innerHTML = '' //reset the div
        const editor = document.createElement('div') //create new div
        wrapper.append(editor) //append new div to wrapper
        new Quill(editor,{ theme: 'snow', modules: {toolbar: TOOLBAR_OPTIONS}}); //create Quill instance in new div

    },[]) //stable function across renders
    
    return (
    <div className="container" ref={wrapperRef}></div> //once mounted in the DOM, react passes div to wrapperRef function
    );
}
