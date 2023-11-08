import Head from "next/head";
import Image from "next/image";
import { Dispatch, ReactNode, SetStateAction, Suspense, useEffect, useState } from "react";


import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';

import code_of_conduct from "../text/code_of_conduct.md";
import introduction from "../text/introduction.md";
import programme from "../text/programme.md";
import registration from "../text/registration.md";
import travel from "../text/travel.md";
import who from "../text/who.md";
import about from "../text/about_this_event.md";
import resources from "../text/resources.md"

import s from "../text/schedule.json"

type Row = {
  start: string,
  finish: string,
  type_of: string,
  title: string,
  person: string,
  affiliation: string

}

const schedule = s as Row[];

import ReactPlayer from "react-player";


import { AiOutlineMenu } from "react-icons/ai";
import { BsChevronUp } from "react-icons/bs";



const parsetime = (t?: string) => {

  if (t == undefined) {
    return ""
  }
  let event = new Date(t)
  return event.toLocaleTimeString('en-UK').slice(0, 5)
}

/**
 * Render markdown
 * @param children - The markdown text to render
 * @param id - The id for the text block
 * @returns Markdown component
 */
function Markdown({ children, id }: { children: string; id: string }) {
  return (
    <div id={id} className="prose prose-base mx-auto">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

const ReturnButton = () => {
  return <button onClick={() => {
    document.body.scrollIntoView()
  }}><span className="text-xs text-gray-500 flex underline underline-offset-2"><BsChevronUp />Return to top</span></button>
}

const SubPage = ({ text, id, hidereturn, children }: { text: string, id: string, hidereturn?: boolean, children?: ReactNode }) => {
  const show = hidereturn === undefined || hidereturn == true ? true : false;
  return (
    <div className="pb-8">
      <Markdown id={id}>
        {text}
      </Markdown>
      {children}
    { show ? <p className="pb-1"><ReturnButton /></p> : null }
    </div>
  )
}


function CalenderRow({ data }: { data: Row; }) {

  const start = parsetime(data.start);
  const finish = parsetime(data.finish);
  const timeslot = start + "–" + finish;

  if (data.type_of === "section") {
    return <tr>
      <td className="font-bold bg-green-500 w-32"> <span className="p-2">{timeslot}</span></td>
      <td className="font-bold bg-green-500"> <span className="">{data.title}</span></td>
    </tr>;

  }
  if (data.type_of === "talk") {
    return <tr>
      <td colSpan={2}>
        <div className="px-4">
          <span className="font-bold">{data.title}</span><br />
          <span className="font-bold">{data.person}</span>, <span className="italic">{data.affiliation} </span>
        </div>
      </td>
    </tr>;
  }
  if (data.type_of === "break") {
    return <tr>
      <td className="bg-gray-300 w-32"><span className="p-2 align-middle">{timeslot}</span></td>
      <td className="bg-gray-300">{data.title}</td>
    </tr>;
  }

  if (data.type_of === "discussion") {
    return <tr>
      <td colSpan={2}>
        <div className="px-4">{data.title}</div>
      </td>
    </tr>;
  }

  return <></>;
}




function Calendar() {

  return (
    <div className="container">
      <table className="mx-auto max-w-screen-md" cellPadding="5px" cellSpacing="5px">
        <thead className="font-bold">
        </thead>
        <tbody>
          { schedule.map((data: Row, index: number) => <CalenderRow data={data} key={index} />)}
        </tbody>
      </table>
    </div>
  );

}

function Navbar({ isNavExpanded, setIsNavExpanded }: { isNavExpanded: boolean, setIsNavExpanded: Dispatch<SetStateAction<boolean>> }) {


  return (
    <nav id="nav" className="flex flex-col md:justify-end bg-zinc-100">
      <span className="mx-auto"><button
        className="md:hidden text-zinc-800 py-5"
        onClick={() => {
          setIsNavExpanded(!isNavExpanded)
        }}
      >
        <AiOutlineMenu />
      </button>
      </span>
      <div
        className={
          isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
        }
      >
        <ul className="navbar">
          <li className="menu-item"><a onClick={() => { setIsNavExpanded(!isNavExpanded) }} href="#about" >About</a></li>
          <li className="menu-item"><a onClick={() => setIsNavExpanded(!isNavExpanded)} href="#who">Who is it for?</a></li>
          <li className="menu-item"><a onClick={() => setIsNavExpanded(!isNavExpanded)} href="#programme">Programme</a></li>
          <li className="menu-item"><a onClick={() => setIsNavExpanded(!isNavExpanded)} href="#registration">Registration</a></li>
          <li className="menu-item"><a onClick={() => setIsNavExpanded(!isNavExpanded)} href="#travel">Travel</a></li>
          {/* <li className="menu-item"><a onClick={() => setIsNavExpanded(!isNavExpanded)} href="#code_of_conduct">Code of Conduct</a></li> */}
          <li className="menu-item"><a onClick={() => setIsNavExpanded(!isNavExpanded)} href="#resources">Resources</a></li>
        </ul>
      </div>
    </nav>
  );
}

const Register = () => {
  return (<div className="flex mx-auto py-5">
    <a href="https://www.tickettailor.com/events/universityofsussex/986909" target="_blank" className="reg">Register here</a>
    </div>)
}


const Hero = () => {
  return (
    <div className="w-full h-auto py-16 bg-[url('https://www.eicworkshop.info/hero3_small_blur.jpeg')] bg-cover bg-center flex justify-center items-center">
          <div className="flex flex-col justify-center items-center">
              <h1 className=" text-center text-5xl text-white font-bold drop-shadow-lg">
          Environmental impacts of computing in <br /> health & life sciences research
              </h1>
          </div>
      </div>
    )
}


export default function Home() {

  const [isNavExpanded, setIsNavExpanded] = useState<boolean>(false)
  return (
    <>
      <Head>
        <title>Environmental impacts of computing in health & life sciences research</title>
        <meta name="description" content="Environmental impacts of computing in health & life sciences research" />
      </Head>
      <div className="flex min-h-screen flex-col justify-top mx-auto drop-shadow-lg ">
        <header className="mx-auto max-w-7xl">
          <Hero />
          <div className="pb-30 px-10 mx-auto bg-green-900 pt-5 text-white">
            <p className="pb-5 text-2xl font-bold">
              Are you a health or life sciences researcher who uses computing in your work?<br />
              Are you concerned about the carbon footprint of your research?
            </p>
            <p className="pb-5 text-2xl font-bold">
              Join us for a free workshop on Greener Research Computing for Health &
              Life Sciences at the Wellcome Trust in London
            </p>
          </div>
        </header>
        <main className="container mx-auto bg-white max-w-7xl">
          <Navbar isNavExpanded={isNavExpanded} setIsNavExpanded={setIsNavExpanded} />
          <div className="px-10 py-10">
            <article className={`article`} >
              {/* <article className={`article ${isNavExpanded ? "blur" : ""}`} > */}
              <SubPage text={introduction.toString()} id="none" hidereturn={false}>
                <Register></Register>
              </SubPage>
              <SubPage text={about.toString()} id="about" />
              <SubPage text={who.toString()} id="who" />
              <SubPage text={programme.toString()} id="programme">
                <Calendar></Calendar>
              </SubPage>
              <SubPage text={registration.toString()} id="registration"> 
                <Register></Register>
              </SubPage>
              <SubPage text={travel.toString()} id="travel" />
              <SubPage text={code_of_conduct.toString()} id="code_of_conduct" />
              <SubPage text={resources.toString()} id="resources">
              <div className="pt-5">
              <ReactPlayer fallback={<></>} url="https://www.youtube.com/watch?v=S59UOH3HLFo" width="auto" />
              </div>
              </SubPage>
            </article>
          </div>
        </main>
        <span className="w-full"></span>
        <footer className="md:max-w-7xl mx-auto w-full bg-white border-t-2 border-gray-100">
          <div className="prose prose-base px-5 pt-4 text-gray-500">With support from</div>
          <div className="md:grid md:grid-cols-3 px-10 pb-10 flex flex-col md:gap-1 gap-5 mx-auto items-center">
            <div className="mx-auto"><Image alt="MRC Logo" className="logo" src="MRC.svg" width="220" height="100" /></div>
            <div className="mx-auto"><Image alt="Wellcome Logo" className="logo" src="WEL.svg" width="220" height="100" /></div>
            <div className="mx-auto"><Image alt="Software Sustainability Institute Logo" width="220" height="100" className="logo" src="SSI.svg" /></div>
          </div>
        </footer>
      </div>
    </>
  );
}

