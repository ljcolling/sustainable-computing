import Head from "next/head";
import Document from "next/document"
import Link from "next/link";


import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw'

import introduction from "../../text/introduction.md"
import programme from "../../text/programme.md"
import registration from "../../text/registration.md"
import travel from "../../text/travel.md"
import code_of_conduct from "../../text/code_of_conduct.md"

import schedule from "../../text/programme.json"
import { ReactNode, useState } from "react";

type row = typeof schedule[0];

const parsetime = (t: string) => {
  t = t.split(" ")[0] + "T" + t.split(" ")[1] + "Z";
  let event = new Date(t)
  return event.toLocaleTimeString('en-UK').slice(0, 5)
}



const Markdown = ({ children, id }: { children: string, id: string }) => {
  return (
    <div id={id} className="prose prose-base mx-auto">
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}>
        {children}
      </ReactMarkdown>
    </div>
  );
};

const SubPage = ({text, id, children}: {text: string, id: string, children?: ReactNode}) => {
  return  (
    <div className="pt-8">
      <Markdown id={id}>
        {text}
      </Markdown>
    {children}
    <div className="pb-5"><a href="#nav"><span className="text-xs text-gray-500">Return to top</span></a></div>
  </div>
  )
}


/* const ReferenceDisplay = ({ reference }: { reference: Reference}) => { */
const Row = ({ data }: { data: row }) => {
  //let i = 0;
  let this_type: string = data.type_of
    let start = parsetime(data.start)
    let finish = parsetime(data.finish)
    let timeslot = start + "–" + finish

  if (this_type === "section") {
    return <tr><td className="font-bold bg-green-500" colSpan={2}>
    <span className="p-2">{data.title}</span>
    </td></tr>
  }
  if (this_type === "talk") {
    return <tr>
      <td className="w-32"><span className="p-2 align-middle">{timeslot}</span></td>
      <td>
        <span className="font-bold">{data.title}</span><br />
        <span className="font-bold">{data.person}</span>, <span className="italic">{data.affiliation} </span>
      </td>
    </tr>
  }
  if (this_type === "break") {
    return <tr>
      <td className="bg-gray-300 w-32"><span className="p-2 align-middle">{timeslot}</span></td>
      <td className="bg-gray-300">{data.title}</td>
    </tr>
  }

  if (this_type === "discussion") {
    return <tr>
      <td className="w-32"><span className="p-2 align-middle">{timeslot}</span></td>
      <td>
        {data.title}
      </td>
    </tr>
  }

  return <></>
}


/* {references.map((ref, index) => <ReferenceDisplay key={index} reference={ref} />)} */

const Calendar = () => {
  return (
    <div className="container">
      <table className="mx-auto max-w-screen-md" cellPadding="5px" cellSpacing="5px">
        <thead className="font-bold">
          <tr><td>Time</td><td>Activity</td></tr>
        </thead>
        <tbody>
          {schedule.map((data, index) => <Row data={data} key={index} />)}
        </tbody>
      </table>
    </div>
  )

}

function Navbar() {
  const [isNavExpanded, setIsNavExpanded] = useState(false)

  return (
    <nav id="nav" className="flex flex-col md:justify-end w-full bg-black">
      <button
        className="md:hidden text-white py-5"
        onClick={() => {
          setIsNavExpanded(!isNavExpanded)
        }}
      >
        MENU
      </button>
      <div
        className={
          isNavExpanded ? "navigation-menu expanded" : "navigation-menu"
        }
      >
        <ul className="navbar">
          <li className="menu-item"><a onClick={() => setIsNavExpanded(!isNavExpanded)} href="#about">About</a></li>
          <li className="menu-item"><a onClick={() => setIsNavExpanded(!isNavExpanded)}  href="#programme">Programme</a></li>
          <li className="menu-item"><a onClick={() => setIsNavExpanded(!isNavExpanded)}  href="#registration">Registration</a></li>
          <li className="menu-item"><a onClick={() => setIsNavExpanded(!isNavExpanded)}  href="#travel">Travel</a></li>
          <li className="menu-item"><a onClick={() => setIsNavExpanded(!isNavExpanded)}  href="#code_of_conduct">Code of Conduct</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Sustainable computing workshop</title>
        <meta name="description" content="Sustainable computing for the life and health sciences" />
      </Head>
      <div className="flex min-h-screen flex-col justify-top">
        <header className="bg-cover" style={{ backgroundImage: `url("hero.jpg")`, backgroundPosition: `bottom` }}>
          <h1 className="text-white text-5xl px-10 pt-16 pb-16 font-bold">
            Green Research Computing for Health & Life Sciences
          </h1>
          <div className="pb-30 px-10">
            <p className="pb-5 text-2xl text-white font-bold">
              Are you a life sciences researcher who uses computing in your work?<br />
              Are you concerned about the carbon footprint of your research?
            </p>
            <p className="text-2xl text-white pb-5 font-bold">
              Join us for a free workshop on Green Research Computing for Health & Life Sciences at the prestigious Wellcome Trust in London!
            </p>
          </div>
        </header>
        <Navbar />
        <main className="container mx-auto">
          <div className="px-10 py-10">
            <article className="article">
              <SubPage text={introduction} id="about" />
              <SubPage text={programme} id="programme">
              <Calendar></Calendar> 
              </SubPage>
              <SubPage text={registration} id="registration" />
              <SubPage text={travel} id="travel" />
              <SubPage text={code_of_conduct} id="code_of_conduct" />
            </article>
          </div>
        </main>
        <span className="w-full border-b-2 border-gray-100"></span>
        <footer className="md:w-[70%] mx-auto">
          <div className="prose prose-base px-5 pt-4 pb-4 text-gray-500">With support from</div>
          <div className="md:grid md:grid-cols-3 px-10 pb-10 flex flex-col gap-10 mx-auto items-center">
           <div className="mx-auto md:mr-auto md:ml-20"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Medical_Research_Council_logo.svg" height="200" width="200" /></div>
           <div className="mx-auto"><img src="https://upload.wikimedia.org/wikipedia/commons/5/58/Wellcome_Trust_logo.svg" height="200" width="100" /></div>
           <div className="mx-auto md:ml-auto md:mr-20"><img src="https://softwaresaved.github.io/software-deposit-guidance/images/ssi.png" height="200" width="300" /></div>
          </div>
        </footer>
      </div>
    </>
  );
}
