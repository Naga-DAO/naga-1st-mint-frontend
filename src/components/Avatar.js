import React from 'react'
import styled from 'styled-components'

const Avatar = styled.div`
  background-image: url("${props => props.src}");
  aspect-ratio: 1;
  border-radius: 50%;
  background-size: auto 102%;
  filter: grayscale(1) opacity(.7) drop-shadow(2px 4px 6px rgba(0,0,0,.3));
  
  &:hover {
    filter: drop-shadow(2px 4px 6px rgba(0,0,0,.3));
    background-image: url("${props => props.srcHover}");
  }
`

export default (props) => {
  return (
    <Avatar {...props} />
  )
}
