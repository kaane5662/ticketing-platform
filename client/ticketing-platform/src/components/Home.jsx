import React from "react";

const Home = () => {
    return (
      <div className='bg-primary'>
        <div className='max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
          <p className='bg-complementary font-bold p-2'>
           Scale your brand with SwftT
          </p>
          <h1 className='md:text-7xl sm:text-6xl text-4xl font-bold md:py-6 bg-complementary'>
            Grow with sales
          </h1>
          <div className='flex justify-center items-center'>
            <p className='md:text-5xl sm:text-4xl text-xl font-bold py-4 bg-complementary'>
              Built for sellers
            </p>
            <section
            className='md:text-5xl sm:text-4xl text-xl font-bold md:pl-4 pl-2'
              strings={['BTB', 'BTC', 'SASS']}
              typeSpeed={120}
              backSpeed={140}
              loop
            />
          </div>
          <p className='md:text-2xl text-xl font-bold bg-secondary'>Make partying your focus not the tickets!</p>
          <button className='bg-[#00df9a] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black'>Get Started</button>
        </div>
        
      </div>
    );
  };

export default Home;