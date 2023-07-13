import React from "react";


export default function Home(){
    const[data, setData] = React.useState({
        _id: "",
        name: "",
        email: "",
        gender: "",
        status: ""

    });
    function handle(e){
        const dataClone = {...data};
        dataClone[e.target.name] = e.target.value
        setData(dataClone)
    }

    function handleAddSubmit(event){
        event.preventDefault();
        let dataClone = data;
        console.log(dataClone)
        fetch('/api/users', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataClone)
        })
        .then(response => response.json())
        .then(json => {alert("Successfully Created User")})
    }
    
  return (
    <div className="App">
        <main id="site-main">
            <div class="container">
                <div class="box-nav d-flex justify-between">
                <div class="filter">
                    <a href="/"><i class="fas fa-angle-double-left"></i> All Users</a>
                </div>
                </div>
                <div class="form-title text-center">
                    <h2 class="text-dark">New User</h2>
                    <span class="text-light">Use the below form to create a new account</span>
                </div>


<<<<<<< Updated upstream
                <form method="POST" id="add_user" onSubmit={handleAddSubmit}>
=======
                <form action="http://merninstance-07062023:3500/api/users" method="POST" id="add_user">
>>>>>>> Stashed changes
                <div class="new_user">
                    <div class="form-group">
                        <label for="name" class="text-light">Name</label>
                        <input type="hidden" name="id" value={data._id}></input>
                        <input onChange={(e) => handle(e)} type="text" name="name" value={data.name} placeholder="Mark Stoenis"></input>
                    </div>
                    <div class="form-group">
                        <label for="Email" class="text-light">Email</label>
                        <input onChange={(e) => handle(e)} type="text" name="email" value={data.email} placeholder="example@gmail.com"></input>
                    </div>
                    <div class="form-group">
                        <label for="gender" class="text-light">Gender</label>
                        <div class="radio inline">
                            <input onChange={(e) => handle(e)} type="radio" id="radio-2" name="gender" value="Male" checked={data.gender === 'Male' ? true : false}></input>
                            <label for="radio-2" class="radio-label">Male</label>
                        </div>
                        <div class="radio inline">
                            <input onChange={(e) => handle(e)} type="radio" id="radio-3" name="gender" value="Female" checked={data.gender === 'Female' ? true : false}></input>
                            <label for="radio-3" class="radio-label">Female</label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="gender" class="text-light">Status</label>
                        <div class="radio inline">
                            <input onChange={(e) => handle(e)} type="radio" id="radio-4" name="status" value="Active" checked={data.status === 'Active' ? true : false}></input>
                            <label for="radio-4" class="radio-label">Active</label>
                        </div>
                        <div class="radio inline">
                            <input onChange={(e) => handle(e)} type="radio" id="radio-5" name="status" value="Inactive" checked={data.status === 'Inactive' ? true : false}></input>
                            <label for="radio-5" class="radio-label">Inactive</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn text-dark update">Save</button>
                    </div>
                </div>
                </form>
            
            </div>
        </main>
    </div>
    );
}
