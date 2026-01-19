import { Testimonial } from "@/types/testimonial";

const starIcon = (
  <svg width="18" height="16" viewBox="0 0 18 16" className="fill-current">
    <path d="M9.09815 0.361679L11.1054 6.06601H17.601L12.3459 9.59149L14.3532 15.2958L9.09815 11.7703L3.84309 15.2958L5.85035 9.59149L0.595291 6.06601H7.0909L9.09815 0.361679Z" />
  </svg>
);

const userAvatarIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
    <path d="M12.0002 14.5C6.99016 14.5 2.91016 17.86 2.91016 22C2.91016 22.28 3.13016 22.5 3.41016 22.5H20.5902C20.8702 22.5 21.0902 22.28 21.0902 22C21.0902 17.86 17.0102 14.5 12.0002 14.5Z" fill="currentColor"/>
  </svg>
);


const SingleTestimonial = ({ testimonial }: { testimonial: Testimonial }) => {
  const { star, name, content, designation } = testimonial;

  let ratingIcons = [];
  for (let index = 0; index < star; index++) {
    ratingIcons.push(
      <span key={index} className="text-yellow">
        {starIcon}
      </span>,
    );
  }

  return (
    <div className="w-full">
      <div className="shadow-two hover:shadow-one dark:bg-dark dark:shadow-three dark:hover:shadow-gray-dark rounded-xs bg-white p-8 duration-300 lg:px-5 xl:px-8">
        <div className="mb-5 flex items-center space-x-1">{ratingIcons}</div>
        <p className="border-body-color/10 text-body-color mb-8 border-b pb-8 text-base leading-relaxed dark:border-white/10 dark:text-white">
          “{content}
        </p>
        <div className="flex items-center">
          <div 
            className="mr-4 flex h-[50px] w-[50px] items-center justify-center rounded-full text-white"
            style={{ backgroundColor: '#FF6B35' }}
          >
            {userAvatarIcon}
          </div>
          <div className="w-full">
            <h3 className="text-dark mb-1 text-lg font-semibold lg:text-base xl:text-lg dark:text-white">
              {name}
            </h3>
            <p className="text-body-color text-sm">{designation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTestimonial;
