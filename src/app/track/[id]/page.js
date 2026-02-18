import TrackClient from "./TrackClient";

export function generateStaticParams() {
  return [{ id: "_" }];
}

export default function TrackPage() {
  return <TrackClient />;
}
