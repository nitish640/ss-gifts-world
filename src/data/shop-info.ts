export const shop = {
  shortName: "SSG",
  name: "Sri Swetchavathi Gift World",
  owner: "Bujji Achary",
  phones: ["+91 90306 90787", "+91 91148 00665"],
  whatsapp: "919030690787",
  email: "ssgiftworld.ichapuram@gmail.com",
  address: {
    line1: "Market Road, Radham Street",
    line2: "Ichapuram, Srikakulam Dist, AP 532312",
    full: "Market Road, Radham Street, Ichapuram, Srikakulam Dist, Andhra Pradesh 532312",
  },
  hours: "Mon – Sun, 9:30am – 9:30pm",
  map: {
    lat: 19.1167,
    lng: 84.6833,
    embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3788.583196657209!2d84.680718!3d19.1167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA3JzAwLjEiTiA4NMKwNDAnNTkuOSJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    directions: "https://www.google.com/maps/search/?api=1&query=Sri+Swetchavathi+Gift+World+Market+Road+Ichapuram+532312",
  },
} as const;

export const waLink = (text = "Hi SSG Gift World, I'd like to know more about your gift items.") =>
  `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(text)}`;
