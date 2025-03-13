import React from 'react'
import logo from '../assets/logo.png'

const Footer = () => {
  return (
    <div className=' bg-gray-900'>
        <hr />
        <div className='bg-gray-900 flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-2 text-sm'>
            {/*----- Left------*/}
            <div>
                <img className='mb-5 w-40' src={logo} alt="PrimeResidency Logo" />
                <p className='w-full md:w-2/3 text-white leading-6'>
                    PrimeResidency offers premium living spaces designed for modern lifestyles. Whether you're looking for a cozy apartment or a spacious family home, we provide luxury and comfort at affordable prices. 
                </p>
            </div>

            {/*----- Center------*/}
            <div>
                <p className='text-xl text-white font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-white'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Amenities</li>
                    <li>Pricing & Availability</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>

            {/*----- Right------*/}
            <div>
                <p className='text-xl text-white font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-white'>
                    <li>+94-077-678-9098</li>
                    <li>info@primeresidency.lk</li>
                    <li>123 PrimeResidency Ave, Colombo, Sri Lanka</li>
                </ul>
            </div>
        </div>

        {/*-----------*/ }
        <div>
            
            <p className='py-5 text-gray-400 text-sm text-center'>
                Copyright 2024 @ PrimeResidency.lk - All Rights Reserved. 
            </p>
        </div>
    </div>
  )
}

export default Footer
