import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import Button from './Button'

const WalletAddress = () => {
  const [text, setText] = useState('Copy')
  const blockchain = useSelector((state) => state.blockchain)

  const handleCopy = () => {
    setText('Copies')

    setTimeout(() => {
      navigator.clipboard.writeText(blockchain.account)
      setText('Copy')
    }, 250)
  }

  return (
    <>
      {blockchain.account}{' '}
      <Button onClick={handleCopy} small>
        {text}
      </Button>
    </>
  )
}

export default React.memo(WalletAddress)
