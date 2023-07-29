import styled from 'styled-components'
export const CahtStyled = styled.div`
    height: 100%;
    display: flex;

    .headImg img{
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin: 30px 30px 0px 0;
    }

    .ant-upload-list-item-action{
        display: none
    }

    .content{
        width:100%;
        background-color: white;
        /* margin:100px auto; */
        /* border-radius: 10px; */
        box-shadow:0 0 5px;
        display: flex;
        /* margin: 50px auto; */


        .leftList{
            width: 300px;
            background-color:#775833;


            ul{
                margin: 20px;

                .active{
                    background-color: #C5C4C5
                }

                li{
                    padding:20px 10px;
                    margin: 10px 0;
                    border:1px solid #715237;
                    line-height: 80px;
                    img{
                        width:80px;
                        height: 80px;
                        border-radius: 50%;
                    }

                    span{
                        margin-left: 30px;
                        font-size: 20px;
                    }
                }
            }
        }
        .rightChat{
            width: 100%;
            background-color:#395667;

            .noChat{
                display: flex;
                align-items: center;
                justify-content: center;
                height:100%;
                font-size:30px;
            }

            .title{
                height: 5%;
                background-color: white;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .chatCont{
                height:83%;
                overflow-y: scroll;


                .chat-container{
                    /* width: 200px; */
                    margin: 20px auto;
                    width: 100%;
                    /* background-color: #fff; */
                    /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); */
                    /* border-radius: 10px; */
                    /* overflow: hidden; */
                }

                .chat-message.isAccept .message-content {
                    background-color: #f0f0f0;
                    border-top-right-radius: 5px;
                    border-bottom-right-radius: 5px;
                }

                .chat-message.isSend .message-content {
                    background-color: #d9f5a6;
                    border-top-left-radius: 5px;
                    border-bottom-left-radius: 5px;
                }

                .isSend {
                        justify-content: flex-end;
                }

                .chat-message {
                    padding: 10px;
                    display: flex;
                    align-items: flex-start;

                    img {
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        margin: 0 10px;
                    }

                    .message-content {
                        padding: 8px 12px;
                        max-width: 60%;
                        word-wrap: break-word;
                    }

                }
                
            }

            .sendMeg{
                background-color: white;
                height:12%;
                display: flex;
                align-items: flex-end;

                div{
                    height: 100%;
                    width:100%;
                }

                textarea{
                    margin: 10px 0 0 10px;
                    /* width: 90%;
                    height: 80%; */
                    width: 97%;
                    height: 80%;
                    resize: none;
                    /* background-color: red; */
                    flex:1;
                }

                Button{
                    margin: 0 20px 10px 0;
                }
            }
        }
    }


    
    
`