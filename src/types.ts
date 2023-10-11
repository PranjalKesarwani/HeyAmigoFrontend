
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

type BasicUserDetail = {
  _id: string,
  username: string,
  email: string,
  pic: string
}

type TMessage = {
  docId: string,
  senderId: BasicUserDetail,
  message: string,
  messageType: string
}
type TContact = {
  docId: string,
  firstPId: BasicUserDetail,
  secondPId:BasicUserDetail,
  latestMessage: TMessage,
  allMessages: [TMessage]
}
type TGContact = {
  docId: string,
  members: [BasicUserDetail],
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
    users:[
      {
        _id:string;
        username:string;
        email:string;
        pic:string;
      }

    ];
  }
];

export type TPContact = {
  _id:string;
  chatName:string;
  isGroupChat:boolean;
  users:[
      {
          _id:string;
          username:string;
          email: string;
          pic: string;
      }
  ],
 
}

export type TPMessage = 
  {
    _id:string,
    senderId:string,
    message:string,
    messageType:string,
    chatId:string,
    updatedAt:string
  }



export type TDashChatSlice = {
  isDashChat: boolean;
  searchedData:TSearchedData;
  fetchedPContacts:TPContacts;
  selectedContact:object;
  allPMessages:TPMessage[];
}