import React from "react";


export default function Delete(){
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let id = params.get('id');
    fetch('http://merninstance-07062023:3500/api/users/'+id, {
        method: 'DELETE', 
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': 'DELETE, POST, PUT, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'

        }
    })
    .then(response => response.json())
    .then(alert("Successfully Deleted User"))
    .then(document.location.href = "/")
}
