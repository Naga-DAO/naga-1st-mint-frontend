import styled from 'styled-components'

const Button = styled.button`
  border: 2px solid white;
  background: #00100f;
  color: white;
  border-radius: 10px;
  font-size: ${props => props.small ? '12px' : '18px'};
  cursor: pointer;
`

export default Button
