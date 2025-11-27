import { useLocation } from "react-router-dom";
import { useState } from "react";

export const About = () => {
  const location = useLocation();
  const page = location.pathname;
  console.log(page);
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="text-main-dark w-full flex flex-col laptop:m-auto animate-fadeIn">
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

        <p className="font-body text-justify">
          Im a Finnish- Ghanaian dancer, dance teacher, choreographer and doula.
          I love groove, flow, a sense of freedom and belonging. In my dance
          universe (and life) I'm constantly drawn for these elements. Besides
          my passion for dance I love nature, children, colors and community. My
          heart burns for creating for and with children and youth. Id love to
          see a world where <span className="font-semibold">children</span> and
          youth get to grow up being in their superpowers.
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
          src="https://res.cloudinary.com/duegke8je/video/upload/v1745322213/about_Ama_Kyei_ux2wgv.mp4"
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
              Im a Finnish- Ghanaian dancer, dance teacher, choreographer and
              doula. I love groove, flow, a sense of freedom and belonging. In
              my dance universe (and life) I'm constantly drawn for these
              elements. Besides my passion for dance I love nature, children,
              colors and community. My heart burns for creating for and with
              children and youth. Id love to see a world where{" "}
              <span className="font-semibold">children</span> and youth get to
              grow up being in their superpowers.
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
      <div className="hidden laptop:flex justify-between gap-10 ">
        {/* Video spanning all three columns in the top row */}
        <video
          src="https://res.cloudinary.com/duegke8je/video/upload/v1745322213/about_Ama_Kyei_ux2wgv.mp4"
          type="video/mp4"
          alt="about video"
          className="w-1/2 rounded-xl animate-fadeInVideo min-w-[400px]"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Introductory text in the second row, first column */}
        <div className="col-span-1 row-span-1 flex flex-col gap-8 justify-end max-w-[600px]">
          <p className="font-heading text-base font-semibold text-right mb-4 max-w-[320px] self-end">
            I'm a Finnish-Ghanaian dancer, dance teacher, choreographer, and
            doula.
          </p>
          <p className="font-body text-justify">
            Im a Finnish- Ghanaian dancer, dance teacher, choreographer and
            doula. I love groove, flow, a sense of freedom and belonging. In my
            dance universe (and life) I'm constantly drawn for these elements.
            Besides my passion for dance I love nature, children, colors and
            community. My heart burns for creating for and with children and
            youth. Id love to see a world where{" "}
            <span className="font-semibold">children</span> and youth get to
            grow up being in their super&shy;powers.
          </p>
        </div>

        {/* Longer text in the second row, second column */}
      </div>
      {/* White background with education info spanning all three columns in the bottom row */}
      <div className="hidden laptop:flex flex-col mt-20 h-fit w-full max-w-[800px] p-10 rounded-xl border border-green">
        <h4 className="font-heading mb-4">Education</h4>
        <div className="flex gap-6 justify-between">
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
              <span className="font-semibold">
                Traditional West African dances
              </span>
              <br />
              Ecoles des Sables, Senegal (2019)
            </li>
            
          </ul>

          <p className="text-justify self-end font-body pt-4 w-1/2">
            Besides these official studies, I've studied contemporary and modern
            West-African dances in Ghana and Benin. My doula education I did in
            Cape Coast, Ghana at A Life of Peace School (2022). I've been
            teaching dance since 2010, and my passion for teaching stems from my
            desire to both be and to create environments free from worry, where
            self-expression is the goal and joy is guaranteed.
          </p>
        </div>
      </div>
    </section>
  );
};
