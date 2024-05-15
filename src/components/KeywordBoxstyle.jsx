import React from 'react'

const KeywordBox = ({selected,text,onClick}) => {
  return (
    <h4 className={`py-2 px-4 rounded-3xl  border border-secondary ${selected ? 'text-white bg-gradient-infitik' :'text-secondary'} !cursor-pointer`} onClick={onClick}>
        {text}
    </h4>
  )
}

export default KeywordBox