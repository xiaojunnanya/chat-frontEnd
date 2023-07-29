import styled from 'styled-components'
interface ICanvasStyledProps {
    $isErasing?: boolean
}


export const CanvasStyled = styled.div<ICanvasStyledProps>`
    margin-left: 20px;
    .inOnline{
        
        .headImgShow{
            vertical-align: middle;
        }
    }

    .two{
        display: flex;

        .canvas{

            box-shadow:0 0 5px;
            canvas{
                cursor: ${props => (props.$isErasing ? 'move' : 'crosshair')};
            }
        }

        .three{
            width: 150px;
            text-align: center;

            .lineSize{
                margin-left: 0 !important;
                margin-top: 20px;
            }


            .btn{
                margin: 30px 0;
            }
        }
    }
    
    

`