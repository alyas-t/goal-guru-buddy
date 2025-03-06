
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-coach-dark items-center justify-center p-8">
        <div className="max-w-md text-white">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in">Goal Guru</h1>
          <p className="text-xl opacity-90 mb-8 animate-slide-up delay-150">Your personal AI coach to help you achieve your goals and build lasting habits.</p>
          <div className="space-y-6 animate-slide-up delay-300">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-white">1</span>
              </div>
              <div>
                <h3 className="text-lg font-medium">Set personalized goals</h3>
                <p className="text-white/80">Define what matters to you and track your progress daily.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-white">2</span>
              </div>
              <div>
                <h3 className="text-lg font-medium">Get daily accountability</h3>
                <p className="text-white/80">Check in every morning and reflect every evening.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-white">3</span>
              </div>
              <div>
                <h3 className="text-lg font-medium">Chat with your AI coach</h3>
                <p className="text-white/80">Get personalized advice via text or voice conversation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
