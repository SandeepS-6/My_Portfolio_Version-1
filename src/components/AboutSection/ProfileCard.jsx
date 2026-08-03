import ResumeButton from "./ResumeButton";
import SocialLinks from "./SocialLinks";
import QuickInfoCard, { StoryBlock } from "./QuickInfoCard";
import { mediaUrl } from "../../utils/mediaUrl";
import "./ProfileCard.css";

function ProfileCard({ data }) {
  const photo = data.photo;
  const photoSrc = mediaUrl(photo?.src);

  return (
    <article className="about-profile">
      <div className="about-profile__row">
        <div className="about-profile__lead">
          {photoSrc ? (
            <img
              className="about-profile__photo"
              src={photoSrc}
              alt={photo.alt || data.name || ""}
              width="128"
              height="128"
              loading="lazy"
            />
          ) : null}

          <div className="about-profile__identity">
            <p className="about-profile__greeting">{data.greeting}</p>
            <h3 className="about-profile__name">{data.name}</h3>
            <p className="about-profile__title">{data.title}</p>
            {data.location ? (
              <p className="about-profile__location">{data.location}</p>
            ) : null}
          </div>
        </div>

        <div className="about-profile__actions">
          <ResumeButton
            label={data.resumeLabel}
            href={data.resumeHref}
            fileName={data.resumeFileName}
          />
          <SocialLinks items={data.socials} />
        </div>
      </div>

      <div className="about-profile__body">
        <StoryBlock paragraphs={data.story} />

        <QuickInfoCard
          status={data.status}
          experienceYears={data.experienceYears}
          phone={data.phone}
          phoneHref={data.phoneHref}
          availability={data.availability}
          interests={data.interests}
        />
      </div>
    </article>
  );
}

export default ProfileCard;
