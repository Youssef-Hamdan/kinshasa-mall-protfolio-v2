import { AboutCommunitySection } from "./AboutCommunitySection";
import { AmenitiesScrollSection } from "./AmenitiesScrollSection";
import { MallInfoStackingCards } from "./MallInfoStackingCards";
import { HeroSection } from "./HeroSection";
import { HighlightsGallery } from "./HighlightsGallery";
import { InfoHoursSection } from "./InfoHoursSection";
import { MallFooter } from "./MallFooter";
import { MidPageBanner } from "./MidPageBanner";
import { OffersPromotionsSection } from "./OffersPromotionsSection";
import { StoreDirectoryMosaic } from "./StoreDirectoryMosaic";
import { HeroAmenitiesBridge } from "./HomeHeroBridge";
import { ScrollThemeController } from "./ScrollThemeController";

export function MallLanding() {
  return (
    <div className="bg-background text-foreground">
      <ScrollThemeController />
      <HeroSection />
      <HeroAmenitiesBridge />
      <AmenitiesScrollSection />
      
      <InfoHoursSection />
      <MallInfoStackingCards />
      {/* <MidPageBanner /> */}
      
      <HighlightsGallery />
      {/* <OffersPromotionsSection /> */}
      <StoreDirectoryMosaic />
      <AboutCommunitySection />
      <MallFooter />
    </div>
  );
}
