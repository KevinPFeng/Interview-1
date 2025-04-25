"use client";
import React, { useState, useEffect } from 'react';
import './home.css'

// 定义表单数据类型
interface LoginForm {
  mobile: string;
  code: string;
}

// 手机号正则验证
const MOBILE_REGEX = /^1[3-9]\d{9}$/;

export default function Home() {
  // 状态管理
  const [formData, setFormData] = useState<LoginForm>({ mobile: '', code: '' });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileValid, setIsMobileValid] = useState(false);
  const [isCodeValid, setIsCodeValid] = useState(false);

  // 实时验证手机号
  useEffect(() => {
    if (!formData.mobile) {
      setIsMobileValid(false);
      setErrors(prev => ({
        ...prev,
        mobile: '请输入手机号'
      }));
      return;
    }
    const isValid = MOBILE_REGEX.test(formData.mobile);
    setIsMobileValid(isValid);
    setErrors(prev => ({
      ...prev,
      mobile: isValid ? undefined : '手机号格式错误'
    }));
  }, [formData.mobile]);

  // 实时验证6位验证码
  useEffect(() => {
    if (!formData.code) {
      setIsCodeValid(false);
      setErrors(prev => ({
        ...prev,
        code: '请输入验证码'
      }));
      return;
    }
    const isValid = !!formData.code && formData.code?.length === 6;
    setIsCodeValid(isValid);
    setErrors(prev => ({
      ...prev,
      code: isValid ? undefined : '验证码格式错误'
    }));
  }, [formData.code]);

  // 输入处理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 客户端验证
    const newErrors: Partial<LoginForm> = {};
    if (!formData.mobile) {
      newErrors.mobile = '请输入手机号';
    } else {
      if (!isMobileValid) newErrors.mobile = '手机号格式错误';
    }
    if (!formData.code) {
      newErrors.code = '请输入验证码';
    } else {
      if (!isCodeValid) newErrors.code = '验证码格式错误';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setErrors({});
    }

    try {
      setIsSubmitting(true);
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('提交成功:', formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 获取验证码
  const handleGetCode = () => {
    console.log('获取验证码:', formData.mobile);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-item">
        <input placeholder="手机号" name="mobile" value={formData.mobile} onChange={handleInputChange} />
        {/* 表单错误提示，会出现两种情况
        1.必填校验，错误提示“请输入手机号”
        2.格式校验，需满足国内手机号规则，错误提示“手机号格式错误”
        举例：<p className="form-error">手机号格式错误</p> */}
        {errors.mobile && <span className="error">{errors.mobile}</span>}
      </div>

      <div className="form-item">
        <div className="input-group">
          <input placeholder="验证码" name="code" value={formData.code} onChange={handleInputChange} />
          {/* getcode默认disabled=true，当mobile满足表单验证条件后才位false */}
          <button className="getcode" type="button" disabled={!isMobileValid} onClick={handleGetCode}>
            获取验证码
          </button>
        </div>
        {/* 表单错误提示，会出现两种情况
        
        1.必填校验，错误提示“请输入验证码”
        2.格式校验，6位数字，错误提示“验证码格式错误”
        举例：<p className="form-error">验证码格式错误</p> */}
        {errors.code && <span className="error">{errors.code}</span>}
      </div>

      {/* 表单提交中，按钮内的文字会变成“submiting......” */}
      <button className="submit-btn" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : '登录'}</button>
    </form>
  );
}
