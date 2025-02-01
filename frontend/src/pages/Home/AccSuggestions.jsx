import { useEffect } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAccountSuggestions } from "../../redux/Home/accountSlice";

import LoaderSvg from "../../utils/svg/LoaderSvg";
import AccountItem from "../../components/common/AccountItem";

const AccSuggestions = () => {
  const dispatch = useDispatch();
  const { data: user } = useSelector((state) => state.user);
  const { accounts, loading } = useSelector((state) => state.accounts);

  useEffect(() => {
    dispatch(fetchAccountSuggestions());
  }, [dispatch]);

  return !loading ? (
    <div className="hidden ml-2 sm:hidden lg:block lg:min-w-[21%] lg:h-[50%] lg:mt-2 rounded-lg bg-slate-800 p-4 flex-col">
      <div className="text-xl pl-1 pb-2 font-normal text-white">
        Accounts to follow
      </div>
      <div className="p-1 flex flex-col gap-y-2 py-2">
        {accounts &&
          accounts.slice(0, 5).map((acc, i) => {
            return (!user.following.includes(acc._id) && (<AccountItem key={i} acc={acc} />));
          })}
      </div>
    </div>
  ) : (
    <div className="lg:min-w-[21%] lg:h-[50%] lg:mt-2 p-4 bg-slate-800 rounded-xl ml-4">
      <div className="text-xl pl-1 pb-2 font-normal text-white">
        Accounts to follow
      </div>
      <div className="flex justify-center items-center w-full h-[85%]">
        <LoaderSvg height="30" width="30" />
      </div>
    </div>
  );
};

export default AccSuggestions;
