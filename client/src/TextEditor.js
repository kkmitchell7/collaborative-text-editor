import React, { useCallback } from 'react'
import Quill from 'quill'
import './styles.css'
import "quill/dist/quill.snow.css"

export default function TextEditor() {
    //Prevents duplication of quill element upon rerender
    const wrapperRef = useCallback((wrapper)=>{ //wrapper is div object, useCallback invoked with the DOM element attached/detached from component
        if (wrapper == null) return
        wrapper.innerHTML = '' //reset the div
        const editor = document.createElement('div') //create new div
        wrapper.append(editor) //append new div to wrapper
        new Quill(editor,{ theme: 'snow'}); //create Quill instance in new div

    },[]) //stable function across renders
    
    return (
    <div className="container" ref={wrapperRef}></div> //once mounted in the DOM, react passes div to wrapperRef function
    );
}
