/* eslint-disable no-useless-escape */
import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'


const Signup = ()=>{
    const history = useHistory()
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)
    useEffect(()=>{
        if(url){
           uploadFields() 
        }
    })

    const uploadPic =()=>{

        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","instagram-clone")
        data.append("cloud_name","instagrampics24")
        fetch("https://api.cloudinary.com/v1_1/instagrampics24/image/upload",{
          method:"post",
          body:data
        })
        .then(res=>res.json())
        .then(data=>{
          setUrl(data.url)
        })
        .catch(err=>{
          console.log(err)
        })
    }
    const uploadFields = ()=>{

        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:"Please fill in all the details",classes:"#c62828 red darken-3"})
            return
   
           }
           fetch("/signup",{
               method:"post",
               headers:{
                   "Content-Type":"application/json"
               },
               body:JSON.stringify({
                   name,
                   password,
                   email,
                   pic:url
               })
           }).then(res=>res.json())
           .then(data=>{
               if(data.error){
                   M.toast({html:data.error,classes:"#c62828 red darken-3"})
   
               }
               else{
                   M.toast({html:data.message,classes:"#43a047 green darken-1"})
                   history.push('/signin')
               }
           }).catch(err=>{
               console.log(err)
           })   
    }
        const PostData = ()=>{
            if (image){
                uploadPic()
            }else{
                uploadFields()

            }
    
    }
    return(
        <div className="mycard">
        <div className="card auth-card input-field">
        <div className="insta-logo">
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png" alt="logo" srcset="" width="100em"></img>
        </div>
        <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        />
        <input
        type="text"
        placeholder="Email Id"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />
        <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />
        <div className="file-field input-field">
      <div className="btn">
        <span>Upload Pic</span>
        <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
      </div>
      <div className="file-path-wrapper">
        <input className="file-path validate" type="text" />
      </div>
    </div>
         <button className="btn waves-effect waves-light"
         onClick={()=>PostData()}
          >
         Sign Up
  </button>
  <h5>
      <Link to="/Signin">Already Have An Account?</Link>
  </h5>
        


        </div>
        </div>
        
    )
    

}



export default Signup