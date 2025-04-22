
import { useLocation } from "react-router-dom";
import { useState } from "react"

export const About = () => {
  const location = useLocation();
  const page = location.pathname;
  console.log(page);
  const [ showMore, setShowMore ] = useState(false)

  return (
    <section className="text-main-dark w-full flex flex-col laptop:w-10/12 laptop:m-auto animate-fadeIn">
      <h3 className="text-2xl font-heading text-right mb-10">About</h3>
      {/* Mobile */}
      <div className="flex flex-col gap-12 tablet:hidden">
        <video
          src="https://res.cloudinary.com/duegke8je/video/upload/v1745322213/about_Ama_Kyei_ux2wgv.mp4"
          type="video/mp4"
          alt="about video"
          className="w-full rounded-xl animate-fadeInVideo"
          autoPlay
          muted
          loop
          playsInline
        />
        <p className="font-heading">
          Im a Finnish- Ghanaian dancer, dance teacher, choreographer and doula.{" "}
        </p>

        <p className="font-body">
          I looove groove, flow, music and presence also known as dance. Besides
          my passion for dance I love nature, children, colors and community. My
          heart burns for creating for and with children and youth. Id love to
          see a world where <span className="font-semibold">children</span> and{" "}
          <span className="font-semibold">youth</span> got to grow up being in
          their superpowers.
        </p>
        <div className="bg-main-white w-full p-6 rounded-xl border border-green">
          <h4 className="font-heading mb-4">Education</h4>
          <ul className="flex flex-col gap-4 font-body">
            <li>
              <span className="font-semibold">Dancer</span>
              <br />
              Åsa folkhögskola (2014-2016)
            </li>
            <li>
              <span className="font-semibold">
                Bachelor in dance pedagogy <br />
              </span>
              University of Arts in Stockholm (2017-2020)
            </li>

            <li>
              <span className="font-semibold">
                Traditional West African dances <br />
              </span>
              Ecoles des Sables, Senegal (2019)
            </li>
          </ul>
        </div>
        <p className="text-justify font-body">
          Besides these official studies Ive studied contemporary and modern
          West- African dances in Ghana and Benin. My doula education I did in
          Cape Coast, Ghana at A life of peace- school (2022).
          <br />
          I've been teaching dance since 2010 and my passion for teaching stems
          from my desire to both be and to create environments free from worrie,
          where self expression is the goal and joy is garanteed.
        </p>
      </div>
      {/* tablet */}
      <div className="hidden tablet:flex tablet:flex-col gap-16 laptop:hidden">
        <video
          src="https://res.cloudinary.com/dbf8xygxz/video/upload/v1726561289/about_Ama-kyei-wanda.mp4"
          type="video/mp4"
          alt="about video"
          className="w-full rounded-xl animate-fadeInVideo"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="flex gap-10">
          <div className="flex flex-col w-1/2 gap-8 pr-4">
            <p className="font-heading text-sm font-semibold mb-4 ">
              Im a Finnish- Ghanaian dancer, dance teacher, choreographer and
              doula.{" "}
            </p>
            <p className="font-body text-justify">
              I looove groove, flow, music and presence also known as dance.
              Besides my passion for dance I love nature, children, colors and
              community. My heart burns for creating for and with children and
              youth. Id love to see a world where{" "}
              <span className="font-semibold">children</span> and{" "}
              <span className="font-semibold">youth</span> got to grow up being
              in their superpowers.
            </p>
            <p className="text-justify font-body">
              Besides these official studies Ive studied contemporary and modern
              West- African dances in Ghana and Benin. My doula education I did
              in Cape Coast, Ghana at A life of peace- school (2022).
              <br />
              I've been teaching dance since 2010 and my passion for teaching
              stems from my desire to both be and to create environments free
              from worrie, where self expression is the goal and joy is
              garanteed.
            </p>
          </div>
          <div className="flex flex-col w-1/2 pl-4 gap-8">
            <div className="bg-main-white p-6 rounded-xl border border-green">
              <h4 className="font-heading mb-4">Education</h4>
              <ul className="flex flex-col gap-4 font-body">
                <li>
                  <span className="font-semibold">Dancer</span>
                  <br />
                  Åsa folkhögskola (2014-2016)
                </li>
                <li>
                  <span className="font-semibold">
                    Bachelor in dance pedagogy <br />
                  </span>
                  University of Arts in Stockholm (2017-2020)
                </li>

                <li>
                  <span className="font-semibold">
                    Traditional West African dances <br />
                  </span>
                  Ecoles des Sables, Senegal (2019)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
{/* Laptop */}
<div className="hidden laptop:grid grid-cols-4 gap-x-20 ">
  {/* Video spanning all three columns in the top row */}
  <div className="col-span-2 row-span-1 flex justify-center">
    <video
      src="https://res.cloudinary.com/dbf8xygxz/video/upload/v1726561289/about_Ama-kyei-wanda.mp4"
      type="video/mp4"
      alt="about video"
      className="w-full rounded-xl animate-fadeInVideo"
      autoPlay
      muted
      loop
      playsInline
    />
  </div>

  {/* Introductory text in the second row, first column */}
  <div className="col-span-1 row-span-1 flex flex-col gap-8 justify-end">
    <p className="font-heading text-base font-semibold text-right mb-4">
      I'm a Finnish-Ghanaian dancer, dance teacher, choreographer, and doula.
    </p>
    <p className="font-body text-justify">
      I looove groove, flow, music and presence also known as dance. Besides
      my passion for dance, I love nature, children, colors, and community. My
      heart burns for creating for and with children and youth. I'd love to see
      a world where <span className="font-semibold">children</span> and{" "}
      <span className="font-semibold">youth</span> got to grow up being in
      their superpowers.
    </p>
    
  </div>

  {/* Longer text in the second row, second column */}

  {/* White background with education info spanning all three columns in the bottom row */}
  <div className="col-start-4 col-end-5 row-start-1 row-end-3 h-fit bg-main-white p-6 rounded-xl border border-green self-end">
    <h4 className="font-heading mb-4">Education</h4>
    <ul className="flex flex-col gap-4 font-body">
      <li>
        <span className="font-semibold">Dancer</span>
        <br />
        Åsa folkhögskola (2014-2016)
      </li>
      <li>
        <span className="font-semibold">Bachelor in dance pedagogy</span>
        <br />
        University of Arts in Stockholm (2017-2020)
      </li>
      <li>
        <span className="font-semibold">Traditional West African dances</span>
        <br />
        Ecoles des Sables, Senegal (2019)
      </li>
      <button type="button" className="border w-fit p-2 rounded-xl m-auto" onClick={()=> setShowMore(!showMore)}>{showMore ? "Show less" : "Show more"}</button>
    </ul>
    {showMore && <p className="text-justify font-body pt-4">
      Besides these official studies, I've studied contemporary and modern
      West-African dances in Ghana and Benin. My doula education I did in
      Cape Coast, Ghana at A Life of Peace School (2022). I've been teaching
      dance since 2010, and my passion for teaching stems from my desire to
      both be and to create environments free from worry, where self-expression
      is the goal and joy is guaranteed.
    </p>
    }
  </div>
</div>
    </section>
  );
};
