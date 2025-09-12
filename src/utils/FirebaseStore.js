// import auth from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';

// export function loginCheck(data){
//   const user = {
//     user_id : data?.id+"",
//     password : "123456",
//     mobile : data?.mobile,
//     email : data?.mobile + "@election.in",
//     role_name : data?.role_name,
//     name : data?.first_name,
//     profile_pic : data?.profile_photo_path,
//     division_id : data?.division_id,
//     booth_id : data?.booth_id
//   }
//   let uid = "";
//  auth().createUserWithEmailAndPassword(user.email,user.password).then(data => {
//     uid = data?.user?.uid;
//     // let userRef = this.db.object(`/users/${uid}`);
//     database().ref("/users").child(user?.user_id).push({Id: user.Id, email: user.email, name: user.name, user_id: user.user_id, mobile: user.mobile,role_name: user.role_name,division_id : user.division_id,booth_id : user.booth_id,profile_pic: user.profile_pic,uid:uid});
//     // console.log("uid "+uid);
//   },(reason) => {
//     // console.log("Error "+reason)
//   auth().signInWithEmailAndPassword(user.email,user.password).then(data => {
//     uid = data?.user?.uid;
//     userCheck(user,uid);
//   });
//   }).catch(()=> {
//     return uid;
// } );
//     return uid;
// }
// export async function updateFirebaseUser(data){
//   if(!data) return;
//   const user = {
//     user_id : data?.id+"",
//     password : "123456",
//     mobile : data?.mobile,
//     email : data?.mobile + "@election.in",
//     role_name : data?.role_name,
//     name : data?.first_name,
//     profile_pic : data?.profile_photo_path,
//     division_id : data?.division_id,
//     booth_id : data?.booth_id
//   }
//   let uid = "";
//  auth().createUserWithEmailAndPassword(user.email,user.password).then(data => {
//     uid = data?.user?.uid;
//     // let userRef = this.db.object(`/users/${uid}`);
//     database().ref("/users").child(user?.user_id).push({Id: user.Id, email: user.email, name: user.name, user_id: user.user_id, mobile: user.mobile,role_name: user.role_name,division_id : user.division_id,booth_id : user.booth_id,profile_pic: user.profile_pic,uid:uid});
//     // console.log("uid "+uid);
//   },(reason) => {
//     console.log("Error "+reason)

//     database().ref("/users").child(user?.user_id).on("value" , snap => {
//       let resp = snap.val();
//       if(resp){
//         let keys = Object.keys(resp);
//         if(keys?.length == 1)
//         database().ref("/users").child(user?.user_id).child(keys[0]).update({Id: user.Id, email: user.email, name: user.name, user_id: user.user_id, mobile: user.mobile,role_name: user.role_name,division_id : user.division_id,booth_id : user.booth_id,profile_pic: user.profile_pic,uid:uid});
//         return;
//       }else{
//         database().ref("/users").child(user?.user_id).push({Id: user.Id, email: user.email, name: user.name, user_id: user.user_id, mobile: user.mobile,role_name: user.role_name,division_id : user.division_id,booth_id : user.booth_id,profile_pic: user.profile_pic,uid:uid});
//         return;
//       }
//     });
//   });
// }
// export async function createFirebaseUser(data){
//   if(!data) return;
//   const user = {
//     user_id : data?.id+"",
//     password : "123456",
//     mobile : data?.mobile,
//     email : data?.mobile + "@election.in",
//     role_name : data?.role_name,
//     name : data?.first_name,
//     profile_pic : data?.profile_photo_path,
//     division_id : data?.division_id,
//     booth_id : data?.booth_id
//   }
//   let uid = "";
//  auth().createUserWithEmailAndPassword(user.email,user.password).then(data => {
//     uid = data?.user?.uid;
//     // let userRef = this.db.object(`/users/${uid}`);
//     database().ref("/users").child(user?.user_id).push({Id: user.Id, email: user.email, name: user.name, user_id: user.user_id, mobile: user.mobile,role_name: user.role_name,division_id : user.division_id,booth_id : user.booth_id,profile_pic: user.profile_pic,uid:uid});
//     // console.log("uid "+uid);
//   },(reason) => {
//     // console.log("Error "+reason)

//   });
// }
// export async function userCheck(user,uid){

//     database().ref("/users").child(user?.user_id).on('value', snapshot => {
//         let data = snapshot.val();
//         if(!data) {
//             database().ref("/users").child(user?.user_id).push({Id: uid, email: user.email, name: user.name, user_id: user.user_id, mobile: user.mobile,profile_pic: user.profile_pic, role_name: user.role_name,division_id : user.division_id,booth_id : user.booth_id,uid:uid});
//             return;
//         }
//         // const items = Object.values(data);
//         // console.log("array",items);
//       });
// }
// export async function getGroupData(user){
//         try{
//         var promise = new Promise((resolve, reject) => {
//           database().ref('Groups').on('value',async snap => {
//             var res = snap.val();
//             let array = [];
//             if(!res){resolve([]);return;}
//             for(let key of Object.values(res)){
//               for(let data of Object.values(key)){
//               let snapshots = await database().ref('Groups').child(data.Owner).child(data.Key).child('Members').orderByChild('user_id').equalTo(user?.id).once('value', async snapshot => {return snapshot.val()});
//               if(snapshots.val() == null || snapshots.val() == 'null'){
// // console.log(null);
//               }else{
//                   let cc = {...data,Members:data.Members ? Object.values(data.Members) : []}
//                   array.push(cc);
//                 }
//               }
//             }
//             resolve(array);
//           },err =>{reject(err);
//           })
//         });
//         return promise;
//           }catch{
//             return null;
//           }
// }
// export async function  getUserD(elm) { 
//   try{
//   let resp = new Promise((resolve,reject)=>{
//   database().ref('users').child(String(elm.user_id)).orderByChild("user_id").equalTo(String(elm.user_id)).on('value', snap => {
//     var dat = snap.val();
//     if(dat){
//       var dat = Object.values(dat);
//       // console.log(dat);
//       if(dat.length > 0){
//         resolve(dat[0]);
//         return dat[0];
//       }
//     }
//     resolve(dat)
//     //  return snap.val()
//     },err =>{reject(err);
//     });
// }).catch(()=> {return;});
// return resp;
// }catch{
// return;
// }
// }