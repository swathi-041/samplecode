import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({children,onClick}){
  return(
    <button className="button" onClick={onClick}>{children}</button>
  )
}
export default function App(){
  const [friends,setFriends]=useState(initialFriends);
  const [show,setShow]=useState(false);
  const [selectFriend,setSelectFriend]=useState(null);
  function handleShower()
  {
    setShow((show)=>!show)
  }
  function handleFriends(friend)
  {
    setFriends((friends)=>[...friends,friend])
    setShow(false)
  }
  function handleSelectFriend(friend){
    setSelectFriend((cur)=>cur?.id===friend.id ? null :friend)
    setShow(false)
  }
  function handleSplit(value){
    console.log(value)
    setFriends((friends)=>
    friends.map((friend)=>friend.id===selectFriend.id ? {...friend,balance:friend.balance+value}: friend))
    setSelectFriend(null);
  }
  return(
    <div className="app">
      <div className="sidebar">
     <FriendList friends={friends} handleSelect={handleSelectFriend} selectFriend={selectFriend}/>
     {show && <Formaddfriend handleFriends={handleFriends} />}
     <Button onClick={handleShower}>{show ? "Close" : "Addfriend"}</Button>
    </div>
    {selectFriend && <Formsplitbill selectFriend={selectFriend} handleSplit={handleSplit}/>}
    </div>
  )
}
function FriendList({friends,handleSelect,selectFriend}){
  return(
    <ul>List
    {friends.map((friend)=>(
      <Friend friend={friend} key={friend.id} handleSelect={handleSelect} selectFriend={selectFriend}/>
    ))
    }
   </ul>
  )
}
function Friend({friend,handleSelect,selectFriend}){
  const isSelected=selectFriend?.id===friend.id
  return(
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}/>
      <h3>{friend.name}</h3>
      {friend.balance<0 && 
      <p className="red">you owes {friend.name} {Math.abs(friend.balance)}$</p>
      }
       {friend.balance>0 && 
      <p className="green"> {friend.name} owes you {Math.abs(friend.balance)}$</p>
      }
       {friend.balance===0 && 
      <p>   you and  {friend.name} are even</p>
      }
      <Button className="button" onClick={()=>handleSelect(friend) }>{isSelected? "close" : "select"}</Button>
    </li>
  )
}

function Formaddfriend({handleFriends})
{
  const [name,setName]=useState("");
  const [image,setImage]=useState("https://i.pravatar.cc/48?u=499476")
  
  function handleSubmit(e)
  {
    e.preventDefault();
   if(!name || !image) return
   const id =crypto.randomUUID();
   const newFriend={
    id,
    name,
    image: `${image}?=${id}`,
    balance:0
   }
    handleFriends(newFriend)
    setName("")
    setImage("https://i.pravatar.cc/48?u=499476")
  }
 return(
  <form className="form-add-friend" onSubmit={handleSubmit}>
    <label>👪Friend Name:</label>
    <input type="text" value={name} onChange={(e)=>setName(e.target.value)}/>

    <label>🖼️Image URL:</label>
    <input type="text" value={image} onChange={(e)=>setImage(e.target.value)}/>


    <Button>Add</Button>
  </form>
 )
}
function Formsplitbill({selectFriend,handleSplit}){
  const[bill,setBill]=useState("");
  const[paidByuser,setpaidByuser]=useState("");
  const [whopay,setWhopay]=useState("user");
  const paid=bill? bill-paidByuser : "";
  function onSplit(e){
    e.preventDefault();
    if(!bill || !paidByuser) return
    handleSplit(whopay==="user" ? paid : -paidByuser)
  }
  return(
    <form className="form-split-bill" onSubmit={onSplit}>

      <h2>SPLIT BILL WITH {selectFriend.name}</h2>

     <label>💰BILL VALUE</label>
     <input type="text" value={bill} onChange={(e)=>setBill(Number(e.target.value))}/>
     <label>🧍‍♂️Your expense</label>
     <input type="text" value={paidByuser} onChange={(e)=>setpaidByuser(Number(e.target.value)>bill ? paidByuser:Number(e.target.value))}/>
     <label> 🧑‍🤝‍🧑{selectFriend.name}'s expense</label>
     <input type="text" value={paid} disabled/>
     <label>🤑Who is paying the bill </label>
     <select  value={whopay} onChange={(e)=>setWhopay(e.target.value)}>
       <option value="user">YOU</option>
       <option value="friend">{selectFriend.name}</option>
     </select>
     <Button>split bill</Button>
    </form>
  )
}