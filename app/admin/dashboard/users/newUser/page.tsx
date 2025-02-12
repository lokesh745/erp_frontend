"use client";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { fullDeptinfo } from "@/app/interface";
import { generatepass } from "@/app/utils/generatepassword";
import { decodeRole } from "@/app/utils/getRole";
import { toast } from "react-toastify";
import { CustomAxiosError } from "@/app/utils/customError";
import { useRouter } from "next/navigation";
type props = {};

export default function Dashboard(Props: props) {
  const router = useRouter();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["departments"],
    queryFn: () => {
      return axios.get(
        "http://localhost:4500/backend-api/department/all-department",
        {
          withCredentials: true,
        }
      );
    },
  });
  const [file, setFile] = useState(null);
  const deptData: Array<fullDeptinfo> = data?.data.list;
  const [rollNo, setRollNo] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [joining_year, setJoiningYear] = useState("");
  const [passout_year, setPassoutYear] = useState("");
  const [department_name, setDepartmentName] = useState("");
  const [role, setRole] = useState("");
  const formData = new FormData();

  useEffect(() => {
    if (firstName !== "" && lastName !== "") {
      let result = `${firstName}.${lastName}@vit.edu.in`;
      setEmail(result);
    }
  }, [firstName, lastName]);

  const mutation = useMutation({
    mutationKey: ["Register"],
    mutationFn: () => {
      return axios.post(
        "http://localhost:4500/backend-api/auth/register",
        {
          firstName,
          middleName,
          lastName,
          email: email.toLowerCase(),
          phoneNo: phoneNo,
          passout_year: Number(passout_year),
          joining_year: Number(joining_year),
          password,
          rollNo,
          role: decodeRole(role),
          department_name,
        },
        {
          withCredentials: true,
        }
      );
    },
    onSuccess(data, variables, context) {
      toast.success(data.data.msg);
      router.push("/admin/dashboard/users");
    },
    onError(error: CustomAxiosError, variables, context) {
      let message: string = error.response?.data?.msg
        ? error.response?.data?.msg
        : "Api Error";
      toast.error(message);
    },
  });

  const mutation1 = useMutation({
    mutationKey: ["RegisterMultiple"],
    mutationFn: () => {
      console.log(formData.get("file"));
      return axios.post(
        "http://localhost:4500/backend-api/auth/registerMultiple",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
    onSuccess(data, variables, context) {
      toast.success(data.data.msg);
      router.push("/admin/dashboard/users");
    },
    onError(error: CustomAxiosError, variables, context) {
      let message: string = error.response?.data?.msg
        ? error.response?.data?.msg
        : "Api Error";
      toast.error(message);
    },
  });

  const handleRegister = (e: any) => {
    e.preventDefault();
    if (
      firstName !== "" &&
      middleName !== "" &&
      lastName !== "" &&
      phoneNo !== "" &&
      rollNo !== "" &&
      password !== "" &&
      joining_year !== "" &&
      passout_year !== "" &&
      department_name !== "" &&
      role !== ""
    ) {
      mutation.mutate();
    } else {
      toast.warning("Feild is Empty !");
    }
  };

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (file) {
      formData.append("file", file);
    }
    console.log(file);
    mutation1.mutate();
  };

  return (
    <main className="h-[280px] bg-[#212529]">
      <div className="pt-[70px]"></div>
      <form className="flex justify-end" onSubmit={handleSubmit}>
        <div className="w-[300px] mt-5 flex flex-col items-end  gap-3   ">
          <div className="h-full flex flex-col gap-3 ">
            <h1 className="text-white font-bold text-2xl py-2 ">
              Add Excel (.csv)
            </h1>
            <input
              type="file"
              className="w-[300px] rounded-md hover:cursor-pointer text-white "
              onChange={handleFileChange}
              name="file"
            />
          </div>
          <button
            type="submit"
            className="w-[100px] text-black rounded-sm bg-purple-400 h-[42px]  active:bg-purple-500 mr-5  "
          >
            Add
          </button>
        </div>
      </form>
      <div className="mt-[120px] rounded-xl bg-white min-h-[500px] mx-3 lg:mx-5">
        <div className="text-black h-[70px] flex gap-x-3 border-y-2  border-black">
          <h1 className="text-4xl mt-3 ml-5">New User</h1>
          <div className="mt-3">
            <FaRegUser size={35} />
          </div>
        </div>
        <form className="flex flex-col lg:flex-row">
          <div className="lg:w-[50%] flex flex-col gap-4 ">
            <div className="flex flex-col sm:flex-row gap-y-2 my-4 ">
              <label className=" text-2xl mx-3 flex items-end " htmlFor="">
                First Name -
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-[90%] sm:w-[60%] h-[40px] border-b-2 bg-white text-2xl border-black  mx-3 "
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-y-2 my-4 ">
              <label className=" text-2xl mx-3 flex items-end " htmlFor="">
                Middle Name -
              </label>
              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="w-[90%] sm:w-[60%] h-[40px] border-b-2 bg-white text-2xl border-black  mx-3 "
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-y-2 my-4 ">
              <label className=" text-2xl mx-3 flex items-end " htmlFor="">
                Last Name -
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-[90%] sm:w-[60%] h-[40px] border-b-2 bg-white text-2xl border-black  mx-3 "
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-y-2 my-4 ">
              <label className=" text-2xl mx-3 flex items-end " htmlFor="">
                Email -
              </label>
              <input
                type="text"
                readOnly
                value={email.toLowerCase()}
                className="w-[90%] sm:w-[60%] h-[40px] border-b-2 bg-white text-2xl border-black  mx-3 "
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-y-2 my-4 ">
              <label className=" text-2xl mx-3 flex items-end " htmlFor="">
                Phone No -
              </label>
              <input
                type="text"
                maxLength={10}
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="w-[90%] sm:w-[60%] h-[40px] border-b-2 bg-white text-2xl border-black  mx-3 "
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-y-2 my-4 ">
              <label className=" text-2xl mx-3 flex items-end " htmlFor="">
                Roll No -
              </label>
              <input
                type="text"
                onChange={(e) => setRollNo(e.target.value)}
                value={rollNo}
                className="w-[90%] sm:w-[60%] h-[40px] border-b-2 bg-white text-2xl border-black  mx-3 "
              />
            </div>
          </div>
          <div className="lg:w-[50%] flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row  gap-y-2 my-4 ">
              <label className=" text-2xl mx-3 flex items-end " htmlFor="">
                Password -
              </label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className=" w-[90%] sm:max-w-[200px] h-[40px] border-b-2 bg-white text-2xl border-black  mx-3 "
              />
              <button
                type="button"
                className="h-[40px] underline text-violet-500 active:text-violet-300 hover:text-violet-800  w-auto p-3 "
                onClick={() => {
                  setPassword(generatepass());
                }}
              >
                Generate
              </button>
            </div>

            <div className="flex flex-col sm:flex-row  gap-y-2 my-4 ">
              <label className=" text-2xl mx-3 flex items-end " htmlFor="">
                Joining Year -
              </label>
              <input
                type="number"
                maxLength={4}
                value={joining_year}
                onChange={(e) => setJoiningYear(e.target.value)}
                className="w-[60%] h-[40px] border-b-2 bg-white text-2xl border-black  mx-3 "
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-y-2 my-4 ">
              <label className=" text-2xl mx-3 flex items-end " htmlFor="">
                Passout Year -
              </label>
              <input
                type="number"
                maxLength={4}
                value={passout_year}
                onChange={(e) => setPassoutYear(e.target.value)}
                className="w-[60%] h-[40px] border-b-2 bg-white text-2xl border-black  mx-3 "
              />
            </div>
            <div className="flex   gap-y-2 my-4 ">
              <label className=" text-2xl mx-3 flex items-end " htmlFor="">
                Department -
              </label>
              <select
                onChange={(e) => setDepartmentName(e.target.value)}
                className=" ml-3 bg-[#dee2e6] w-[160px] border-[1px]  border-gray-500 rounded-md"
              >
                <option hidden>Select Dept</option>
                {deptData?.slice(1).map((item: fullDeptinfo) => {
                  return (
                    <option key={item.id} value={item.code}>
                      {item.code}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex   gap-y-2 my-4">
              <label className=" text-2xl mx-3 flex items-end " htmlFor="">
                Role -
              </label>
              <select
                onChange={(e) => setRole(e.target.value)}
                className="ml-3 bg-[#dee2e6] w-[160px] border-[1px]  border-gray-500 rounded-md"
              >
                <option value="" hidden>
                  Select Role
                </option>
                <option value="ADMIN">ADMIN</option>
                <option value="PROFESSOR">PROFESSOR</option>
                <option value="STUDENT">STUDENT</option>
              </select>
            </div>

            <div className="flex justify-end">
              <button
                onClick={(e) => handleRegister(e)}
                className="w-[140px] mr-5 mb-4 text-black rounded-3xl bg-purple-400 h-[42px]  active:bg-purple-500"
              >
                Add User
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
