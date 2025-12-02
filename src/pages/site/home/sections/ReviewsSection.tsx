import { memo } from "react";
import { Star } from "lucide-react";
import FeatureCard from "@/components/ui/feature-card";
import { Card } from "@/components/ui/card";
import { reviews } from "../data/reviewsData";

const ReviewsSection = memo(() => {
  return (
    <section
      className="py-12 md:py-20 bg-white"
      style={{ backgroundColor: "#F5F4F2" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <h2
            className="text-center text-[2.5rem] md:text-[52px]"
            style={{
              lineHeight: "1.2em",
              letterSpacing: "-0.04em",
              fontWeight: 500,
              fontFamily: '"Inter Display", sans-serif',
              marginBottom: "15px",
            }}
          >
            Lo que dicen nuestros clientes
          </h2>
          <div
            className="text-[1.125rem] md:text-xl text-gray-700 md:text-gray-600 text-center font-normal leading-relaxed"
            style={{ textWrap: "pretty" }}
          >
            <span className="md:hidden">
              Opiniones reales de conductores que
              <br />
              encontraron su coche ideal con Autohaus.
            </span>
            <span className="hidden md:inline">
              <div>Opiniones reales de conductores que encontraron</div>
              <div>su coche ideal con Autohaus.</div>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr,1.2fr] gap-6 md:gap-10 items-stretch">
          {/* Highlight review with video using FeatureCard fade style */}
          <FeatureCard
            title={reviews[0].name}
            description={reviews[0].quote}
            image="/images/UI/video-review.mp4"
            imageAlt="Client review highlight"
            gradientPosition="bottom"
            mediaType="video"
            className="h-full"
          >
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-800">
                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  <Star className="w-4 h-4 fill-gray-500 text-gray-500" />
                  <span>{reviews[0].rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-400 text-xs">Google Reviews</span>
              </div>

              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                "{reviews[0].quote}"
              </p>

              <div className="flex items-center gap-3 pt-1 md:pt-2">
                <img
                  src={reviews[0].avatar}
                  alt={reviews[0].name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {reviews[0].name}
                  </p>
                  <p className="text-xs text-gray-500">{reviews[0].role}</p>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Other reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {reviews.slice(1).map((review) => (
              <Card
                key={review.name}
                className="bg-white border-none shadow-sm rounded-2xl md:rounded-3xl p-5 md:p-7 flex flex-col justify-between"
              >
                <div className="mb-3 md:mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs md:text-sm font-medium mb-3 md:mb-4">
                    <Star className="w-3.5 h-3.5 md:w-4 md:h-4 fill-gray-500 text-gray-500" />
                    <span>{review.rating.toFixed(1)}</span>
                    <span className="text-[10px] md:text-[11px] text-gray-400 ml-1">
                      Google Reviews
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                    "{review.quote}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-1 md:pt-2">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {review.name}
                    </p>
                    <p className="text-xs text-gray-500">{review.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

ReviewsSection.displayName = "ReviewsSection";

export default ReviewsSection;
