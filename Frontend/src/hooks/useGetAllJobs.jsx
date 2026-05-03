import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT } from "@/utils/data";
import { SAMPLE_JOBS } from "@/utils/sampleJobs";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { searchedQuery } = useSelector((store) => store.job);

  useEffect(() => {
    const fetchAllJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${JOB_API_ENDPOINT}/get?keyword=${encodeURIComponent(searchedQuery || "")}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.status) {
          dispatch(setAllJobs(res.data.jobs?.length ? res.data.jobs : SAMPLE_JOBS));
        } else {
          dispatch(setAllJobs(SAMPLE_JOBS));
          setError("Failed to fetch jobs.");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        dispatch(setAllJobs(SAMPLE_JOBS));
        setError(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();
  }, [dispatch, searchedQuery]);

  return { loading, error };
};

export default useGetAllJobs;
