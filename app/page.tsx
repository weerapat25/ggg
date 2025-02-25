import RoomBookingForm from "../components/RoomBookingForm"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">ระบบจองห้องประชุม</h1>
      <RoomBookingForm />
    </main>
  )
}

