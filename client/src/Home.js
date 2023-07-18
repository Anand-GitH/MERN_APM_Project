import React from "react";
import Edit from "./Update.js"
import {Route, Link} from 'react-router-dom'

export default function Home(){
  const[data, setData] = React.useState([]);
  React.useEffect(() => {
    fetch("/api/users")
    .then((res) => res.json())
    .then((data) => {
      console.log(data, "userData")
      setData(data);
    });
    }, []); 

  return (
    <div className="App">
    <main id="site-main">
        <div class="container">
            <div class="box-nav d-flex justify-between">
                <a href="/add-user" class="border-shadow">
                    <span class="text-gradient">New User <i class="fas fa-user"></i></span>
                </a>
            </div>
            <form action="/" method="POST">
                <table class="table">
                    <thead class="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>@Email</th>
                            <th>Gender</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                      {data.map(i => {
                        return(
                          <tr>
                            <td>1</td>
                            <td>{i.name}</td>
                            <td>{i.email}</td>
                            <td>{i.gender}</td>
                            <td>{i.status}</td>
                            <td>
                                <a href={"/update-user?id=" + i._id} class="btn border-shadow update">
                                    <span class="text-gradient"><i class="fas fa-pencil-alt"></i></span>
                                </a>
                                <a href={"/delete-user?id=" + i._id} class="btn border-shadow delete">
                                    <span class="text-gradient"><i class="fas fa-times"></i></span>
                                </a>
                            </td>
                        </tr>
                        )
                      })}
                    </tbody>
                </table>
            </form>
        </div>
    </main>
    </div>
      );
    }