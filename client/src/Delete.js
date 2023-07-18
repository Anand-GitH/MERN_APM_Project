import React from "react";


export default function Delete(){
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let id = params.get('id');
    fetch('/api/users/'+id, {
        method: 'DELETE', 
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(alert("Successfully Deleted User"))
    .then(document.location.href = "/")
}