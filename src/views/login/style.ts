import styled from 'styled-components'

export const LoginStyled = styled.div`
    .video-box {
        position: absolute;
        height: 100vh;
        width:100%;
        background-color: #C1CFF7;
        /*进行视频裁剪*/
        overflow: hidden;
    }

    .video-box .video-background {
        position: absolute;
        left: 50%;
        top: 50%;
        /*保证视频内容始终居中*/
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        /*保证视频充满屏幕*/
        object-fit: cover;
        min-height: 800px;
    }

    .ant-form-item-required{
        color: white !important
    }
    .form{
        padding-top:150px;
    }
    

    Form{
        margin: 0 auto;
    }
    Button{
        margin: 0 15px;
    }
    
`