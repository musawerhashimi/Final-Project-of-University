import { type ReactNode } from 'react'

function PriceWithCurrency({ children } :{children: ReactNode}) {
  return (
    <div>
      {children}
    </div>
  )
}

export default PriceWithCurrency