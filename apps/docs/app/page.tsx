"use client";
import * as React from "react";
import { Button } from "@ui/components/button";
import { useRouter } from "next/navigation";
import "./page.css";
export default function Page() {
  const router = useRouter();

  function enterPage() {
    router.push("/enter");
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[url('https://images.unsplash.com/photo-1562335461-74e9dade959f?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] text-white p-4 sm:p-6 lg:p-8">
        <img
          src="https://login.vivaldi.net/profile/avatar/Dofomin/EqtKklydaPX5Cpn2.png"
          alt="Logo"
          className="mb-4"
        />
        <div style={{ marginBottom: "25px" }}>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mt-4 md:mt-6 lg:mt-10 text-center mb-10"
            style={{
              backgroundImage: "linear-gradient(to right, #5df605, #7439d2)",
              WebkitBackgroundClip: "text",
              color: "transparent",
              margin: "10px",
            }}
          >
            The Leetcode equivalent for JS.
          </h1>
        </div>
        <div
          className="flex flex-col sm:flex-row items-center justify-center w-full max-w-screen-lg mt-4 mx-auto"
          style={{ gap: "95px" }}
        >
          <div className="box mb-4 sm:mb-0 white-border">
            <div style={{ fontSize: "27px", marginBottom: "10px" }}>
              Turborepo
            </div>
            <div style={{ width: "250px" }}>
              Written in 100% Typescript, NextJS 13, Express JS, RabbitMQ,
              Docker.
            </div>
          </div>
          <div className="box mb-4 sm:mb-0 white-border">
            <div style={{ fontSize: "27px", marginBottom: "10px" }}>
              System Design
            </div>
            <div style={{ width: "260px" }}>
              Code gets added to the volume predefined container stopped, which
              the container gets access to.
            </div>
          </div>
          <div className="white-border">
            <div style={{ fontSize: "27px", marginBottom: "10px" }}>
              Why this?
            </div>
            <div style={{ width: "250px" }}>
              Written this way to prevent server file system attacks if the code
              were to run on the native machine.
            </div>
          </div>
        </div>
        <Button
          style={{
            marginTop: "50px",
            fontSize: "20px",
            paddingTop: "30px",
            paddingBottom: "30px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
          onClick={enterPage}
        >
          Solve a problem!
        </Button>
      </div>
    </>
  );
}
