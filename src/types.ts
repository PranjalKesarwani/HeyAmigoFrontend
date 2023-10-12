
export type TUser = {
  _id: string;
  username: string;
  pic: string;
  email: string;

}

// export  type TUser = {
//   _id:string;
//   username:string;
//   pic:string;
//   email:string;
//   contacts:[TContact]; 
//   grpContacts:[TGContact];
// }


export type TMessage = {
  _id: string,
  senderId: TUser,
  chatId:string
  message: string,
  messageType: string,
  createdAt:string
}
type TContact = {
  docId: string,
  firstPId: TUser,
  secondPId:TUser,
  latestMessage: TMessage,
  allMessages: TMessage[]
}
type TGContact = {
  docId: string,
  members: TUser[],
  latestMessage: TMessage,
  allMessages: [TMessage],
  grpPic: string
}


export type TSearchedData = {
  _id: string,
  username: string,
  email: string
}

export type TPContacts = [
  {
    _id:string;
    chatName:string;
    isGroupChat:boolean;
    users:TUser[];
  }
];

export type TPContact = {
  _id:string;
  chatName:string;
  isGroupChat:boolean;
  users:TUser[],
  latestMessage: TMessage | null,
}

export type TPMessage = 
  {
    _id:string,
    senderId:TUser,
    message:string,
    messageType:string,
    chatId:string,
    createdAt:string
  }



