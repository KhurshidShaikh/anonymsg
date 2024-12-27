"use client"
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay"
import fakeMessages from "@/fakeMessages.json"
 
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function Home() {
  return (
  <>
    <div className=" min-h-screen flex flex-col items-center justify-center p-4 ">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="animate-fade-in-down">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 ">
            Welcome to AnonyMsg
          </h1>
          <p className="mt-7 text-lg md:text-xl text-gray-600">
            Share your thoughts freely, connect authentically
          </p>
        </div>

        <Carousel 
        className="w-full max-w-xs mx-auto"
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        >
      <CarouselContent>
        {fakeMessages.map((message, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-3xl ">{message.content}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>

        <div className="mt-12 space-y-4 animate-bounce-slow">
          <Link 
            href="/sign-up"
            className="inline-block px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
          <p className="text-lg text-gray-500">
            Already have an account? <Link href="/sign-in" className="text-purple-600 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
      `}</style>
    </div>
  
  </>
  );
}
