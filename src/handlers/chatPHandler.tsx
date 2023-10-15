// import { setImgWindow } from "../store/slices/dashChatSlice";
// import { useAppDispatch } from "../hooks/hooks";



// export const imageHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {

//     const dispatch = useAppDispatch();

//     if (e.target.files![0] === undefined || e.target.files === null) {
//         alert('Please select an image!');
//         return;
//     }

//     const file = e.target.files![0];

//     const fileInfo = {
//         name: file.name,
//         type: file.type,
//         size: file.size.toString()

//     }
//     console.log(fileInfo);
//     dispatch( setImgWindow(fileInfo))
//   e.target.value = '';


//     // console.log(e.target.files);
//     // if(selectedFile.type === 'image/png' || selectedFile.type === 'image/jpeg'){
//     //     const  data = new FormData();

//     //     data.append("file",selectedFile);
//     //     data.append("upload_preset","myChatApp");
//     //     data.append("cloud_name",'dbyzki2cf');
//     //     const res =await axios.post('https://api.cloudinary.com/v1_1/dbyzki2cf/image/upload',data);;
//     //     console.log(res);
//     //     e.target.value = '';

//     // }
// }