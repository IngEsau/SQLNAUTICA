import React from 'react'
import Text from '../Text/Text.tsx'


const Card = () => {
  return (
    <div className='border border-[#00E5FF66] p-[18px] rounded-[32px] h-[605px] w-[524px]'>
      <div className='bg-[#0A0F1E33] rounded-[32px] h-[564px] w-[488px] p-20'>
        <Text variant='body' children="En las profundidades, el sumergible Eidolon descansa como un mausoleo de expediciones olvidadas. Sus compartimentos guardan registros fragmentados:"/>
        <ul className='list-disc text-white pt-10'>
          <li><Text children="Bitácoras" variant='body'/></li>
          <li><Text children="Mapas" variant='body'/></li>
          <li><Text children="Inventarios" variant='body'/></li>
          <li><Text children="Coordenadas" variant='body'/></li>
        </ul>
      </div>
    </div>
  )
}

export default Card
