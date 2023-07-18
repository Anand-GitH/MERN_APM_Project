import React from "react";


export default function Update(){

  let search = window.location.search;
  let params = new URLSearchParams(search);
  let id = params.get('id');

  const[data, setData] = React.useState([]);
  React.useEffect(() => {
    fetch("/api/users?id=" + id)
    .then((res) => res.json())
    .then((data) => {
      console.log(data, "userData")
      setData(data);
    });
    }, []); 
    
    function handle(e){
        const dataClone = {...data};
        dataClone[e.target.name] = e.target.value
        setData(dataClone)
    }

    function handleSubmit(event){
        event.preventDefault();
        let dataClone = data;
        console.log(dataClone)
        fetch('/api/users/'+dataClone._id, {
            method: 'PUT', 
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataClone)
        })
        .then(response => response.json())
        .then(json => {alert("Successfully Updated User")});
    }
    

  return (
    <div>
    <main id="site-main">
        <div class="container">
            <div class="box-nav d-flex justify-between">
            <div class="filter">
                <a href="/"><i class="fas fa-angle-double-left"></i> All Users</a>
            </div>
            </div>
            <div class="form-title text-center">
                <h2 class="text-dark">Update User</h2>
                <span class="text-light">Use the below form to Update an account</span>
            </div>
            <form method="POST" id="update_user" onSubmit={handleSubmit}>
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
