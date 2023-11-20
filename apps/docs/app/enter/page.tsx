"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./page.css";
import { API_BACKEND_URL } from "@/constants";
import MonacoEditor from "react-monaco-editor";
import { Button } from "@ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@ui/components/card";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@ui/components/select";

interface dataFetched {
  title: string;
  description: string;
  level: string;
  examples: Array<Object>;
  boilerPlate: string;
}

function page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("");
  const [examples, setExamples] = useState([]);
  const [code, setCode] = useState("");

  const handleEditorChange = (newValue, e) => {
    setCode(newValue);
  };

  async function checkCode() {}

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const res = await axios.get(`${API_BACKEND_URL}/problem`);
    const data: dataFetched = await res.data;
    setTitle(data.title);
    setDescription(data.description);
    setLevel(data.level);
    setExamples(data.examples);
    setCode(data.boilerPlate);
  }
  return (
    <div className="container2">
      <div className="left-box" style={{ padding: "30px" }}>
        <h2
          className="mt-10 scroll-m-20  pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
          style={{ color: "white" }}
        >
          {title}
        </h2>
        <div
          style={{
            color:
              level === "Easy" ? "green" : level === "Medium" ? "pink" : "red",
          }}
        >
          {level}
        </div>
        <blockquote
          className="mt-6 border-l-2 pl-6 italic"
          style={{ color: "white" }}
        >
          {description}
        </blockquote>

        <div style={{ marginTop: "30px", marginBottom: "30px" }}>
          {examples.map((example) => (
            <Card
              className="w-[350px]"
              style={{ background: "black", marginBottom: "10px" }}
            >
              <CardHeader></CardHeader>
              <CardContent>
                <div style={{ color: "white" }}>Input: {example.Input}</div>
                <div style={{ color: "white" }}>Output: {example.Output}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button onClick={checkCode}>Submit your Code</Button>
      </div>
      <div className="right-box">
        <MonacoEditor
          width="100%"
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
}

export default page;
