// app/services/[slug]/page.js
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  ChevronLeft,
  Star,
  CheckCircle2,
  Clock,
  Shield,
  MapPin,
  Calendar,
  User,
  ChevronDown,
  Ambulance,
  Activity,
  Bed,
  Stethoscope,
  Home,
  UserPlus,
  TestTube,
  Accessibility,
  Heart,
  Brain,
  Baby,
  Dumbbell,
  Syringe,
  Monitor,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/components/Header";
import FAQSection from "@/components/FAQSection";

const phone = "8874744756";

// ==================== SERVICE CONFIGURATIONS ====================
// Each service has its own configuration. Add your real images to the public folder
// and update these paths or use external URLs like Unsplash.

const SERVICES_CONFIG = {
  ambulance: {
    banner: {
      title: "24x7 Ambulance Service",
      subtitle: "in Lucknow",
      description:
        "Fast, reliable and emergency ambulance service at your doorstep.",
      image: "/services/s1.png",
    },
    types: [
      {
        icon: Ambulance,
        title: "Basic Ambulance",
        desc: "Standard emergency transport",
        image:
          "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300&h=200&fit=crop",
      },
      {
        icon: Activity,
        title: "Oxygen Ambulance",
        desc: "With oxygen cylinder support",
        image:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=200&fit=crop",
      },
      {
        icon: Bed,
        title: "ICU Ambulance",
        desc: "Advanced life support systems",
        image:
          "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=300&h=200&fit=crop",
      },
      {
        icon: Shield,
        title: "Dead Body Ambulance",
        desc: "Respectful mortuary transport",
        image:
          "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&h=200&fit=crop",
      },
    ],
    benefits: [
      { icon: Clock, title: "24x7 Available", desc: "Round the clock service" },
      {
        icon: Activity,
        title: "10-15 Min Response",
        desc: "Quick arrival guaranteed",
      },
      {
        icon: Stethoscope,
        title: "Trained Medical Staff",
        desc: "Professional paramedics",
      },
      { icon: MapPin, title: "GPS Enabled", desc: "Live tracking available" },
    ],
    packages: [
      {
        name: "Basic Package",
        price: "₹1,500",
        period: "per trip",
        features: [
          "Standard ambulance",
          "Basic first aid",
          "Patient transport",
          "Within 10km radius",
        ],
        popular: false,
      },
      {
        name: "Advanced Package",
        price: "₹3,500",
        period: "per trip",
        features: [
          "Oxygen support",
          "Paramedic staff",
          "ECG monitoring",
          "Within 25km radius",
          "Priority response",
        ],
        popular: true,
      },
      {
        name: "ICU Package",
        price: "₹8,000",
        period: "per trip",
        features: [
          "Full ICU setup",
          "Ventilator support",
          "Doctor accompanied",
          "Unlimited distance",
          "24/7 dedicated line",
        ],
        popular: false,
      },
    ],
    serviceAreas: [
      "Gomti Nagar",
      "Indira Nagar",
      "Aliganj",
      "Hazratganj",
      "Aminabad",
      "Chowk",
      "Mahanagar",
      "Jankipuram",
    ],
    testimonials: [
      {
        name: "Rajesh Kumar",
        location: "Gomti Nagar",
        rating: 5,
        text: "Very fast service! Ambulance arrived within 15 minutes. Thanks to the team for the quick response.",
      },
      {
        name: "Anil Sharma",
        location: "Indira Nagar",
        rating: 5,
        text: "Very professional staff. Handled the emergency perfectly. Highly recommended!",
      },
      {
        name: "Neha Verma",
        location: "Aliganj",
        rating: 5,
        text: "Best ambulance service in Lucknow. Clean vehicle and well-equipped.",
      },
    ],
    formFields: [
      { type: "text", placeholder: "Your Name", icon: User },
      { type: "tel", placeholder: "Phone Number", icon: Phone },
      { type: "text", placeholder: "Pickup Location", icon: MapPin },
      {
        type: "select",
        placeholder: "Select Ambulance Type",
        icon: Ambulance,
        options: [
          "Basic Ambulance",
          "Oxygen Ambulance",
          "ICU Ambulance",
          "Dead Body Ambulance",
        ],
      },
    ],
    trustBadge: {
      title: "100% Safe & Reliable",
      points: [
        "Verified Medical Staff",
        "Sanitized Vehicles",
        "GPS Tracking",
        "Affordable Pricing",
      ],
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop",
    },
  },

  physiotherapy: {
    banner: {
      title: "Physiotherapy at Home",
      subtitle: "Professional rehab in your comfort zone",
      description:
        "Expert physiotherapy services delivered to your doorstep for faster recovery.",
      image:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&h=400&fit=crop",
    },
    types: [
      {
        icon: Activity,
        title: "Orthopedic",
        desc: "Bone & joint rehab",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      },
      {
        icon: Brain,
        title: "Neurological",
        desc: "Stroke & nerve care",
        image:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
      },
      {
        icon: Baby,
        title: "Pediatric",
        desc: "Child development",
        image:
          "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=200&fit=crop",
      },
      {
        icon: Dumbbell,
        title: "Sports Injury",
        desc: "Athletic recovery",
        image:
          "https://images.unsplash.com/photo-1518611507436-f9221403cca2?w=300&h=200&fit=crop",
      },
    ],
    benefits: [
      {
        icon: Clock,
        title: "Flexible Timing",
        desc: "Schedule at your convenience",
      },
      {
        icon: User,
        title: "Expert Therapists",
        desc: "Certified professionals",
      },
      { icon: Home, title: "Home Comfort", desc: "No travel needed" },
      {
        icon: Heart,
        title: "Personalized Care",
        desc: "Tailored treatment plans",
      },
    ],
    packages: [
      {
        name: "Single Session",
        price: "₹800",
        period: "per session",
        features: [
          "45 min session",
          "Assessment included",
          "Exercise plan",
          "Basic equipment",
        ],
        popular: false,
      },
      {
        name: "Weekly Package",
        price: "₹3,500",
        period: "5 sessions",
        features: [
          "Daily visits",
          "Progress tracking",
          "Equipment provided",
          "Emergency support",
        ],
        popular: true,
      },
      {
        name: "Monthly Package",
        price: "₹12,000",
        period: "20 sessions",
        features: [
          "Comprehensive rehab",
          "Doctor coordination",
          "Advanced equipment",
          "24/7 phone support",
        ],
        popular: false,
      },
    ],
    serviceAreas: [
      "Gomti Nagar",
      "Indira Nagar",
      "Aliganj",
      "Hazratganj",
      "Aminabad",
      "Chowk",
      "Mahanagar",
      "Jankipuram",
    ],
    testimonials: [
      {
        name: "Ramesh Gupta",
        location: "Mahanagar",
        rating: 5,
        text: "Excellent physiotherapy service! My knee pain reduced significantly after 2 weeks.",
      },
      {
        name: "Sunita Verma",
        location: "Indira Nagar",
        rating: 5,
        text: "The therapist was very professional and helped my mother recover from stroke.",
      },
      {
        name: "Amit Singh",
        location: "Gomti Nagar",
        rating: 5,
        text: "Convenient and effective. Got back to my sport faster than expected.",
      },
    ],
    formFields: [
      { type: "text", placeholder: "Your Name", icon: User },
      { type: "tel", placeholder: "Phone Number", icon: Phone },
      { type: "text", placeholder: "Your Location", icon: MapPin },
      {
        type: "select",
        placeholder: "Select Therapy Type",
        icon: Activity,
        options: [
          "Orthopedic",
          "Neurological",
          "Pediatric",
          "Sports Injury",
          "Post-surgical",
        ],
      },
    ],
    trustBadge: {
      title: "Certified & Trusted",
      points: [
        "Licensed Therapists",
        "Personalized Plans",
        "Modern Techniques",
        "Satisfaction Guaranteed",
      ],
      image:
        "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop",
    },
  },

  doctor: {
    banner: {
      title: "Doctor Visit at Home",
      subtitle: "Qualified MDs at your doorstep",
      description: "Consult experienced doctors from the comfort of your home.",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&h=400&fit=crop",
    },
    types: [
      {
        icon: User,
        title: "General Physician",
        desc: "Family medicine",
        image:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=200&fit=crop",
      },
      {
        icon: Heart,
        title: "Cardiologist",
        desc: "Heart specialist",
        image:
          "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=300&h=200&fit=crop",
      },
      {
        icon: Activity,
        title: "Orthopedic",
        desc: "Bone & joint specialist",
        image:
          "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=200&fit=crop",
      },
      {
        icon: Baby,
        title: "Pediatrician",
        desc: "Child specialist",
        image:
          "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=200&fit=crop",
      },
    ],
    benefits: [
      { icon: Clock, title: "Same Day Visit", desc: "Quick appointments" },
      {
        icon: Stethoscope,
        title: "Experienced Doctors",
        desc: "5+ years experience",
      },
      {
        icon: Shield,
        title: "Accurate Diagnosis",
        desc: "Professional assessment",
      },
      { icon: Home, title: "Home Comfort", desc: "No waiting rooms" },
    ],
    packages: [
      {
        name: "Consultation",
        price: "₹1,200",
        period: "per visit",
        features: [
          "45 min consultation",
          "Basic examination",
          "Prescription",
          "Follow-up advice",
        ],
        popular: false,
      },
      {
        name: "Health Checkup",
        price: "₹2,500",
        period: "per visit",
        features: [
          "Full body checkup",
          "Vital monitoring",
          "ECG if needed",
          "Lab recommendations",
        ],
        popular: true,
      },
      {
        name: "Senior Care",
        price: "₹2,000",
        period: "per visit",
        features: [
          "Geriatric assessment",
          "Medication review",
          "Caregiver guidance",
          "Monthly package available",
        ],
        popular: false,
      },
    ],
    serviceAreas: [
      "Gomti Nagar",
      "Indira Nagar",
      "Aliganj",
      "Hazratganj",
      "Aminabad",
      "Chowk",
      "Mahanagar",
      "Jankipuram",
    ],
    testimonials: [
      {
        name: "Vijay Kumar",
        location: "Aliganj",
        rating: 5,
        text: "Doctor arrived on time and gave proper attention. Much better than clinic visits.",
      },
      {
        name: "Priya Singh",
        location: "Gomti Nagar",
        rating: 5,
        text: "Very convenient for my elderly parents. Doctor was patient and thorough.",
      },
      {
        name: "Sanjay Mishra",
        location: "Hazratganj",
        rating: 5,
        text: "Professional service. Got accurate diagnosis and treatment at home.",
      },
    ],
    formFields: [
      { type: "text", placeholder: "Patient Name", icon: User },
      { type: "tel", placeholder: "Phone Number", icon: Phone },
      { type: "text", placeholder: "Your Location", icon: MapPin },
      {
        type: "select",
        placeholder: "Select Speciality",
        icon: Stethoscope,
        options: [
          "General Physician",
          "Cardiologist",
          "Orthopedic",
          "Pediatrician",
          "Neurologist",
        ],
      },
    ],
    trustBadge: {
      title: "Trusted Medical Care",
      points: [
        "MBBS/MD Doctors",
        "5+ Years Experience",
        "Proper Diagnosis",
        "Follow-up Support",
      ],
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop",
    },
  },

  icu: {
    banner: {
      title: "ICU at Home",
      subtitle: "Critical care in your comfort zone",
      description: "Hospital-grade ICU setup with 24/7 monitoring at home.",
      image:
        "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=1200&h=400&fit=crop",
    },
    types: [
      {
        icon: Monitor,
        title: "Ventilator Care",
        desc: "Mechanical ventilation",
        image:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
      },
      {
        icon: Heart,
        title: "Cardiac ICU",
        desc: "Post-cardiac care",
        image:
          "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=300&h=200&fit=crop",
      },
      {
        icon: Activity,
        title: "Neuro ICU",
        desc: "Neurological care",
        image:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
      },
      {
        icon: UserPlus,
        title: "Post-surgical ICU",
        desc: "Post-op recovery",
        image:
          "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=300&h=200&fit=crop",
      },
    ],
    benefits: [
      { icon: Clock, title: "24/7 Monitoring", desc: "Continuous care" },
      {
        icon: Stethoscope,
        title: "ICU Trained Staff",
        desc: "Critical care nurses",
      },
      {
        icon: Shield,
        title: "Hospital-grade Equipment",
        desc: "Advanced monitors",
      },
      { icon: Home, title: "Familiar Environment", desc: "Better recovery" },
    ],
    packages: [
      {
        name: "Basic ICU",
        price: "₹8,000",
        period: "per day",
        features: [
          "ICU trained nurse",
          "Basic monitoring",
          "Oxygen support",
          "Daily doctor visit",
        ],
        popular: false,
      },
      {
        name: "Advanced ICU",
        price: "₹15,000",
        period: "per day",
        features: [
          "Ventilator support",
          "24/7 doctor",
          "Advanced monitoring",
          "Specialist consultation",
        ],
        popular: true,
      },
      {
        name: "Premium ICU",
        price: "₹25,000",
        period: "per day",
        features: [
          "Full ICU setup",
          "Dedicated team",
          "All equipment",
          "Unlimited meds",
        ],
        popular: false,
      },
    ],
    serviceAreas: [
      "Gomti Nagar",
      "Indira Nagar",
      "Aliganj",
      "Hazratganj",
      "Aminabad",
      "Chowk",
      "Mahanagar",
      "Jankipuram",
    ],
    testimonials: [
      {
        name: "Anand Sharma",
        location: "Mahanagar",
        rating: 5,
        text: "Saved my father's life. ICU at home was much better than hospital.",
      },
      {
        name: "Meena Devi",
        location: "Indira Nagar",
        rating: 5,
        text: "Professional team and equipment. Patient recovered faster at home.",
      },
      {
        name: "Rohit Singh",
        location: "Gomti Nagar",
        rating: 5,
        text: "Excellent critical care service. Nurse was very skilled.",
      },
    ],
    formFields: [
      { type: "text", placeholder: "Patient Name", icon: User },
      { type: "tel", placeholder: "Phone Number", icon: Phone },
      { type: "text", placeholder: "Your Location", icon: MapPin },
      {
        type: "select",
        placeholder: "ICU Type",
        icon: Bed,
        options: [
          "Ventilator Care",
          "Cardiac ICU",
          "Neuro ICU",
          "Post-surgical ICU",
        ],
      },
    ],
    trustBadge: {
      title: "Critical Care Experts",
      points: [
        "ICU Certified Staff",
        "Advanced Equipment",
        "24/7 Doctor Support",
        "Emergency Ready",
      ],
      image:
        "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=400&h=300&fit=crop",
    },
  },

  "home-care": {
    banner: {
      title: "Home Care Services",
      subtitle: "Complete support at home",
      description:
        "Comprehensive care for elderly, disabled, and recovering patients.",
      image:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&h=400&fit=crop",
    },
    types: [
      {
        icon: User,
        title: "Elderly Care",
        desc: "Senior citizen support",
        image:
          "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=300&h=200&fit=crop",
      },
      {
        icon: UserPlus,
        title: "Post-surgical Care",
        desc: "After surgery support",
        image:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=200&fit=crop",
      },
      {
        icon: Accessibility,
        title: "Disability Care",
        desc: "Special needs support",
        image:
          "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop",
      },
      {
        icon: Heart,
        title: "Dementia Care",
        desc: "Memory care support",
        image:
          "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=300&h=200&fit=crop",
      },
    ],
    benefits: [
      { icon: Clock, title: "24/7 Support", desc: "Round the clock care" },
      { icon: User, title: "Trained Caregivers", desc: "Experienced staff" },
      { icon: Shield, title: "Safe & Secure", desc: "Background verified" },
      { icon: Home, title: "Home Environment", desc: "Comfortable care" },
    ],
    packages: [
      {
        name: "Day Care",
        price: "₹2,000",
        period: "per day",
        features: [
          "12 hours care",
          "Basic assistance",
          "Meal prep",
          "Medication reminder",
        ],
        popular: false,
      },
      {
        name: "24/7 Care",
        price: "₹3,500",
        period: "per day",
        features: [
          "Full day care",
          "Personal assistance",
          "Night support",
          "Family updates",
        ],
        popular: true,
      },
      {
        name: "Live-in Care",
        price: "₹25,000",
        period: "per month",
        features: [
          "Continuous care",
          "Dedicated caregiver",
          "All assistance",
          "Doctor coordination",
        ],
        popular: false,
      },
    ],
    serviceAreas: [
      "Gomti Nagar",
      "Indira Nagar",
      "Aliganj",
      "Hazratganj",
      "Aminabad",
      "Chowk",
      "Mahanagar",
      "Jankipuram",
    ],
    testimonials: [
      {
        name: "Suman Gupta",
        location: "Aliganj",
        rating: 5,
        text: "Caregiver was very caring and professional. Helped my mother recover well.",
      },
      {
        name: "Vikram Singh",
        location: "Gomti Nagar",
        rating: 5,
        text: "Excellent home care service. Staff was trustworthy and skilled.",
      },
      {
        name: "Pooja Sharma",
        location: "Indira Nagar",
        rating: 5,
        text: "Best decision for my father's post-surgery care. Highly recommend.",
      },
    ],
    formFields: [
      { type: "text", placeholder: "Your Name", icon: User },
      { type: "tel", placeholder: "Phone Number", icon: Phone },
      { type: "text", placeholder: "Your Location", icon: MapPin },
      {
        type: "select",
        placeholder: "Care Type",
        icon: Home,
        options: [
          "Elderly Care",
          "Post-surgical Care",
          "Disability Care",
          "Dementia Care",
        ],
      },
    ],
    trustBadge: {
      title: "Compassionate Care",
      points: [
        "Trained Caregivers",
        "Background Verified",
        "Personalized Plans",
        "Family Support",
      ],
      image:
        "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=400&h=300&fit=crop",
    },
  },

  nursing: {
    banner: {
      title: "Nursing Care at Home",
      subtitle: "Professional nursing services",
      description: "Skilled nurses for medical care and support at home.",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=400&fit=crop",
    },
    types: [
      {
        icon: UserPlus,
        title: "Basic Nursing",
        desc: "General care",
        image:
          "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300&h=200&fit=crop",
      },
      {
        icon: Stethoscope,
        title: "Trained Nurse",
        desc: "Medical procedures",
        image:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=200&fit=crop",
      },
      {
        icon: Heart,
        title: "ICU Trained",
        desc: "Critical care",
        image:
          "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=300&h=200&fit=crop",
      },
      {
        icon: Baby,
        title: "Baby Care",
        desc: "Newborn support",
        image:
          "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=200&fit=crop",
      },
    ],
    benefits: [
      { icon: Clock, title: "24/7 Available", desc: "Anytime service" },
      { icon: Stethoscope, title: "Skilled Nurses", desc: "GNC registered" },
      {
        icon: Shield,
        title: "Medical Procedures",
        desc: "Injections, wound care",
      },
      { icon: Home, title: "Home Service", desc: "No hospital visits" },
    ],
    packages: [
      {
        name: "Day Shift",
        price: "₹1,200",
        period: "per day",
        features: [
          "12 hours service",
          "Basic care",
          "Medication administration",
          "Vital monitoring",
        ],
        popular: false,
      },
      {
        name: "Night Shift",
        price: "₹1,500",
        period: "per night",
        features: [
          "Night care",
          "Emergency support",
          "Sleep monitoring",
          "Family updates",
        ],
        popular: true,
      },
      {
        name: "24/7 Nursing",
        price: "₹2,800",
        period: "per day",
        features: [
          "Round the clock",
          "All procedures",
          "Doctor coordination",
          "Complete care",
        ],
        popular: false,
      },
    ],
    serviceAreas: [
      "Gomti Nagar",
      "Indira Nagar",
      "Aliganj",
      "Hazratganj",
      "Aminabad",
      "Chowk",
      "Mahanagar",
      "Jankipuram",
    ],
    testimonials: [
      {
        name: "Anita Yadav",
        location: "Chowk",
        rating: 5,
        text: "Nurse was very professional and caring. Helped with my mother's injections.",
      },
      {
        name: "Manoj Tiwari",
        location: "Aminabad",
        rating: 5,
        text: "Excellent nursing care for my father post-surgery. Highly recommend.",
      },
      {
        name: "Shweta Singh",
        location: "Mahanagar",
        rating: 5,
        text: "Best nursing service in Lucknow. Nurse was skilled and punctual.",
      },
    ],
    formFields: [
      { type: "text", placeholder: "Your Name", icon: User },
      { type: "tel", placeholder: "Phone Number", icon: Phone },
      { type: "text", placeholder: "Your Location", icon: MapPin },
      {
        type: "select",
        placeholder: "Nursing Type",
        icon: UserPlus,
        options: ["Basic Nursing", "Trained Nurse", "ICU Trained", "Baby Care"],
      },
    ],
    trustBadge: {
      title: "Qualified Nursing Staff",
      points: [
        "GNC Registered",
        "Experienced",
        "Background Checked",
        "Medical Trained",
      ],
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
    },
  },

  "lab-tests": {
    banner: {
      title: "Lab Test at Home",
      subtitle: "NABL certified lab tests",
      description: "Get accurate lab tests done at home with fast reports.",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=400&fit=crop",
    },
    types: [
      {
        icon: TestTube,
        title: "Basic Tests",
        desc: "CBC, Sugar, etc",
        image:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=200&fit=crop",
      },
      {
        icon: Activity,
        title: "Advanced Tests",
        desc: "Hormones, vitamins",
        image:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
      },
      {
        icon: Heart,
        title: "Cardiac Tests",
        desc: "Lipid profile, troponin",
        image:
          "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=300&h=200&fit=crop",
      },
      {
        icon: Syringe,
        title: "Health Packages",
        desc: "Full body checkup",
        image:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=200&fit=crop",
      },
    ],
    benefits: [
      { icon: Clock, title: "Same Day Collection", desc: "Quick scheduling" },
      { icon: Shield, title: "NABL Certified", desc: "Accurate results" },
      { icon: Home, title: "Home Collection", desc: "No lab visit" },
      { icon: Activity, title: "Digital Reports", desc: "Email/WhatsApp" },
    ],
    packages: [
      {
        name: "Basic Package",
        price: "₹1,200",
        period: "per test",
        features: [
          "CBC, Sugar",
          "Home collection",
          "Digital report",
          "24hr turnaround",
        ],
        popular: false,
      },
      {
        name: "Advanced Package",
        price: "₹3,500",
        period: "per test",
        features: [
          "Liver, Kidney",
          "Hormones",
          "Home collection",
          "12hr turnaround",
        ],
        popular: true,
      },
      {
        name: "Full Body",
        price: "₹8,000",
        period: "package",
        features: [
          "80+ tests",
          "Free collection",
          "Doctor consultation",
          "Same day report",
        ],
        popular: false,
      },
    ],
    serviceAreas: [
      "Gomti Nagar",
      "Indira Nagar",
      "Aliganj",
      "Hazratganj",
      "Aminabad",
      "Chowk",
      "Mahanagar",
      "Jankipuram",
    ],
    testimonials: [
      {
        name: "Ravi Kumar",
        location: "Gomti Nagar",
        rating: 5,
        text: "Very professional phlebotomist. Report was accurate and delivered on time.",
      },
      {
        name: "Sarita Singh",
        location: "Aliganj",
        rating: 5,
        text: "Convenient and reliable. Got my reports on WhatsApp within 24 hours.",
      },
      {
        name: "Deepak Verma",
        location: "Indira Nagar",
        rating: 5,
        text: "Best lab test service at home. Technician was skilled and punctual.",
      },
    ],
    formFields: [
      { type: "text", placeholder: "Your Name", icon: User },
      { type: "tel", placeholder: "Phone Number", icon: Phone },
      { type: "text", placeholder: "Your Location", icon: MapPin },
      {
        type: "select",
        placeholder: "Test Type",
        icon: TestTube,
        options: [
          "Basic Tests",
          "Advanced Tests",
          "Cardiac Tests",
          "Health Packages",
        ],
      },
    ],
    trustBadge: {
      title: "Certified Lab Tests",
      points: [
        "NABL Accredited",
        "Accurate Results",
        "Fast Turnaround",
        "Home Collection",
      ],
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop",
    },
  },

  equipment: {
    banner: {
      title: "Medical Equipment Rental",
      subtitle: "Affordable & reliable equipment",
      description: "Rent high-quality medical equipment for home care.",
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=400&fit=crop",
    },
    types: [
      {
        icon: Bed,
        title: "Hospital Beds",
        desc: "Electric/manual beds",
        image:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
      },
      {
        icon: Activity,
        title: "Oxygen Concentrator",
        desc: "5L/10L machines",
        image:
          "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=200&fit=crop",
      },
      {
        icon: Accessibility,
        title: "Wheelchairs",
        desc: "Manual/electric",
        image:
          "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop",
      },
      {
        icon: Monitor,
        title: "Patient Monitor",
        desc: "Vital signs tracking",
        image:
          "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=300&h=200&fit=crop",
      },
    ],
    benefits: [
      { icon: Clock, title: "Same Day Delivery", desc: "Quick setup" },
      { icon: Shield, title: "Quality Equipment", desc: "Hospital-grade" },
      { icon: Home, title: "Home Setup", desc: "Free installation" },
      { icon: Activity, title: "Maintenance Included", desc: "Free service" },
    ],
    packages: [
      {
        name: "Basic Bed",
        price: "₹3,000",
        period: "per month",
        features: [
          "Manual hospital bed",
          "Free delivery",
          "Free setup",
          "Maintenance included",
        ],
        popular: false,
      },
      {
        name: "Oxygen Setup",
        price: "₹8,000",
        period: "per month",
        features: [
          "5L concentrator",
          "Free delivery",
          "Free setup",
          "24/7 support",
        ],
        popular: true,
      },
      {
        name: "ICU Setup",
        price: "₹25,000",
        period: "per month",
        features: ["Electric bed", "Monitor", "Oxygen", "Full setup & support"],
        popular: false,
      },
    ],
    serviceAreas: [
      "Gomti Nagar",
      "Indira Nagar",
      "Aliganj",
      "Hazratganj",
      "Aminabad",
      "Chowk",
      "Mahanagar",
      "Jankipuram",
    ],
    testimonials: [
      {
        name: "Arvind Kumar",
        location: "Mahanagar",
        rating: 5,
        text: "Rented oxygen concentrator. Equipment was new and worked perfectly.",
      },
      {
        name: "Sneha Singh",
        location: "Gomti Nagar",
        rating: 5,
        text: "Hospital bed was delivered same day. Good quality and affordable rent.",
      },
      {
        name: "Mohan Lal",
        location: "Indira Nagar",
        rating: 5,
        text: "Best equipment rental service. Free maintenance and quick response.",
      },
    ],
    formFields: [
      { type: "text", placeholder: "Your Name", icon: User },
      { type: "tel", placeholder: "Phone Number", icon: Phone },
      { type: "text", placeholder: "Your Location", icon: MapPin },
      {
        type: "select",
        placeholder: "Equipment Type",
        icon: Accessibility,
        options: [
          "Hospital Beds",
          "Oxygen Concentrator",
          "Wheelchairs",
          "Patient Monitor",
          "BiPAP/CPAP",
        ],
      },
    ],
    trustBadge: {
      title: "Reliable Equipment",
      points: [
        "Hospital-grade Quality",
        "Free Delivery",
        "Free Maintenance",
        "24/7 Support",
      ],
      image:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    },
  },
};

// ==================== COMPONENTS ====================
// function Header() {
//   return (
//     <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
//       <div className="flex items-center justify-between px-4 h-14 max-w-7xl mx-auto">
//         <div className="flex items-center gap-3">
//           <Link
//             href="/"
//             className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition"
//           >
//             <ChevronLeft className="w-5 h-5 text-gray-700" />
//           </Link>
//           <div className="relative h-24 w-auto">
//             <Image
//               src="/Dr.Jhatka.png"
//               alt="Dr Jhatka Medicare"
//               width={500}
//               height={100}
//               className="object-contain h-full w-auto"
//               priority
//             />
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <a
//             href={`tel:${phone}`}
//             className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white active:scale-90 transition"
//           >
//             <Phone className="w-5 h-5" />
//           </a>
//           <a
//             href={`https://wa.me/91${phone}`}
//             className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white active:scale-90 transition"
//           >
//             <MessageCircle className="w-5 h-5" />
//           </a>
//         </div>
//       </div>
//     </header>
//   );
// }

function Banner({ config }) {
  return (
    <section className="mt-14 relative w-full bg-primary-soft">
      <div className="max-w-7xl mx-auto">
        <div className="relative h-[320px] sm:h-[380px]">
          <Image
            src={config.image}
            alt={config.title}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-center px-5 sm:px-8 max-w-xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-3xl sm:text-4xl font-bold leading-tight"
            >
              {config.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-primary-light text-lg sm:text-xl font-semibold mt-1"
            >
              {config.subtitle}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/90 text-sm sm:text-base mt-3 max-w-sm"
            >
              {config.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-3 mt-5"
            >
              <a
                href={`tel:${phone}`}
                className="bg-white text-primary px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 active:scale-95 transition shadow-lg"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <a
                href={`https://wa.me/91${phone}`}
                className="bg-primary-dark text-white border-2 border-white/30 px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 active:scale-95 transition"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceTypes({ types }) {
  return (
    <section className="px-4 pt-8 max-w-7xl mx-auto">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
        Our Services
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {types.map((type, i) => {
          const Icon = type.icon;
          return (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center hover:border-primary/20 transition-all active:scale-95 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center mb-3">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">{type.title}</h3>
              <p className="text-[11px] text-gray-500 mt-1">{type.desc}</p>
              {type.image && (
                <div className="w-full mt-3 h-20 relative rounded-lg overflow-hidden">
                  <Image
                    src={type.image}
                    alt={type.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function Benefits({ benefits }) {
  return (
    <section className="px-4 pt-8 max-w-7xl mx-auto">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
        Why Choose Our Service?
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {benefits.map((benefit, i) => {
          const Icon = benefit.icon;
          return (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-2">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-sm font-bold text-gray-900">
                {benefit.title}
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">{benefit.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function Packages({ packages }) {
  const [selectedPackage, setSelectedPackage] = useState(null);

  return (
    <section className="px-4 pt-8 max-w-7xl mx-auto">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
        Packages & Pricing
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {packages.map((pkg, i) => (
          <motion.div
            key={pkg.name}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedPackage(i)}
            className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all ${
              selectedPackage === i
                ? "border-primary bg-primary-soft"
                : "border-gray-100 bg-white hover:border-primary/30"
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}
            <h3 className="text-base font-bold text-gray-900 text-center">
              {pkg.name}
            </h3>
            <div className="text-center mt-3">
              <span className="text-3xl font-bold text-primary">
                {pkg.price}
              </span>
              <span className="text-sm text-gray-500">/{pkg.period}</span>
            </div>
            <ul className="mt-4 space-y-2">
              {pkg.features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-gray-600"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
            <button
              className={`w-full mt-5 py-3 rounded-xl text-sm font-bold transition active:scale-95 ${
                selectedPackage === i
                  ? "bg-primary text-white"
                  : "bg-primary-light text-primary hover:bg-primary hover:text-white"
              }`}
            >
              Select Package
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ServiceAreas({ areas }) {
  return (
    <section className="px-4 pt-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900">Service Areas</h3>
            <p className="text-sm text-primary font-semibold mt-0.5">
              Serving in Lucknow
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Other cities coming soon...
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {areas.map((area) => (
                <span
                  key={area}
                  className="text-xs bg-primary-light text-primary px-3 py-1.5 rounded-lg font-medium"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BookingForm({ config }) {
  return (
    <section className="px-4 pt-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-5">
            {config.formTitle || "Book Service"}
          </h2>
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Booking submitted! We'll contact you soon.");
            }}
          >
            {config.formFields.map((field, i) => {
              const Icon = field.icon;
              return (
                <div key={i} className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  {field.type === "select" ? (
                    <div className="relative">
                      <select className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition appearance-none text-gray-700">
                        <option value="">{field.placeholder}</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  )}
                </div>
              );
            })}
            <button
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-xl text-sm font-bold active:scale-95 transition hover:bg-primary-dark flex items-center justify-center gap-2 mt-2"
            >
              <Calendar className="w-4 h-4" />
              {config.submitButtonText || "Book Now"}
            </button>
          </form>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-primary-soft rounded-2xl p-5 sm:p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="text-base font-bold text-primary-dark">
                {config.trustBadge.title}
              </h3>
            </div>
            <ul className="space-y-3">
              {config.trustBadge.points.map((point, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 relative h-40 rounded-xl overflow-hidden bg-white">
            <Image
              src={config.trustBadge.image}
              alt="Trusted Service"
              fill
              className="object-cover object-top"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Testimonials({ testimonials }) {
  const [active, setActive] = useState(0);
  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="px-4 pt-8 max-w-7xl mx-auto">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
        What Our Customers Say
      </h2>
      <div className="relative">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-1 mb-3">
            {[...Array(testimonials[active].rating)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 text-yellow-500 fill-yellow-500"
              />
            ))}
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {testimonials[active].text}
          </p>
          <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900 text-sm">
                {testimonials[active].name}
              </p>
              <p className="text-xs text-gray-500">
                {testimonials[active].location}
              </p>
            </div>
          </div>
        </motion.div>
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={prev}
            className="p-2 rounded-full bg-gray-100 hover:bg-primary-light transition active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all ${
                  i === active ? "w-6 bg-primary" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="p-2 rounded-full bg-gray-100 hover:bg-primary-light transition active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 rotate-180" />
          </button>
        </div>
      </div>
    </section>
  );
}

function StickyBottomBar() {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, type: "spring" }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-primary sm:hidden"
    >
      <div className="flex items-center">
        <a
          href={`tel:${phone}`}
          className="flex-1 flex items-center justify-center gap-2 text-white py-3.5 font-bold text-sm active:bg-primary-dark transition"
        >
          <Phone className="w-5 h-5" />
          <div className="text-left leading-tight">
            <div className="text-[10px] opacity-90 font-medium">Call Now</div>
            <div>{phone}</div>
          </div>
        </a>
        <div className="w-px h-8 bg-white/20" />
        <a
          href={`https://wa.me/91${phone}`}
          className="flex-1 flex items-center justify-center gap-2 text-white py-3.5 font-bold text-sm active:bg-primary-dark transition"
        >
          <MessageCircle className="w-5 h-5" />
          <div className="text-left leading-tight">
            <div className="text-[10px] opacity-90 font-medium">WhatsApp</div>
            <div>Chat Now</div>
          </div>
        </a>
      </div>
      <div className="h-[env(safe-area-inset-bottom)] bg-primary" />
    </motion.div>
  );
}

// ==================== AMBULANCE PAGE ====================
function AmbulancePage() {
  return (
    <main className="min-h-screen bg-white ">
      <Navbar />
      
      {/* Banner / Header */}
      <section className="mt-14 relative w-full bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-[300px] sm:h-[300px] w-full">
            <Image
              src={SERVICES_CONFIG.ambulance.banner.image}
              alt="Ambulance Services"
              fill
              className="object-cover object-center opacity-90"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative z-10 h-full flex items-end px-5 sm:px-8 pb-6 sm:pb-8">
              <h1 className="text-white text-2xl sm:text-3xl font-semibold tracking-wide shadow-sm">
                Ambulance Services 
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          
          {/* Card 1 */}
          <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            {/* Header */}
            <div className="p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary group-hover:scale-105 transition-transform">
                <Ambulance className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900 leading-tight">Normal Ambulance</h3>
                <div className="text-[11px] text-gray-500 font-medium">Standard emergency transport</div>
              </div>
            </div>
            
            {/* Image Box */}
            <div className="w-full h-64 relative bg-gray-50 overflow-hidden border-y border-gray-100/50">
              <img src="/images/services/basic_ambulance.png" alt="Normal Ambulance" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute top-2 right-2 bg-red-50/95 backdrop-blur-sm text-red-600 text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
                Most Used
              </div>
              <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1.5">
                <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] font-medium px-2 py-1 rounded-md shadow-sm">Stretcher</span>
                <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] font-medium px-2 py-1 rounded-md shadow-sm">First Aid</span>
                <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] font-medium px-2 py-1 rounded-md shadow-sm">Trained Driver</span>
              </div>
            </div>

            {/* Pricing Footer */}
            <div className="p-3.5 flex items-center justify-between bg-white mt-auto">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[18px] font-bold text-gray-900 leading-none">₹1,199</span>
                  <span className="text-gray-400 line-through text-[12px]">₹1,499</span>
                  <span className="bg-green-50 text-primary border border-primary/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">20% OFF</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Base (5km) • After 10km: <span className="font-semibold text-gray-700">₹18/km</span></div>
              </div>
              <a href={`tel:${phone}`} className="bg-primary text-white h-10 px-5 rounded-xl flex justify-center items-center text-[13px] font-semibold hover:bg-primary-dark transition-all active:scale-95 shadow-[0_2px_10px_0_rgba(15,157,88,0.2)] hover:shadow-[0_4px_14px_0_rgba(15,157,88,0.3)]">
                Book
              </a>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center shrink-0 text-primary group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900 leading-tight">Oxygen Ambulance</h3>
                <div className="text-[11px] text-gray-500 font-medium">With oxygen cylinder support</div>
              </div>
            </div>
            
            <div className="w-full h-64 relative bg-gray-50 overflow-hidden border-y border-gray-100/50">
              <img src="/images/services/oxygen_ambulance.png" alt="Oxygen Ambulance" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1.5">
                <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] font-medium px-2 py-1 rounded-md shadow-sm">O2 Cylinder</span>
                <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] font-medium px-2 py-1 rounded-md shadow-sm">Oximeter</span>
                <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] font-medium px-2 py-1 rounded-md shadow-sm">Attendant</span>
              </div>
            </div>

            <div className="p-3.5 flex items-center justify-between bg-white mt-auto">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[18px] font-bold text-gray-900 leading-none">₹1,699</span>
                  <span className="text-gray-400 line-through text-[12px]">₹1,999</span>
                  <span className="bg-green-50 text-primary border border-primary/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">15% OFF</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Base (5km) • After 10km: <span className="font-semibold text-gray-700">₹22/km</span></div>
              </div>
              <a href={`tel:${phone}`} className="bg-primary/10 text-primary h-10 px-5 rounded-xl flex justify-center items-center text-[13px] font-semibold hover:bg-primary hover:text-white transition-all active:scale-95">
                Book
              </a>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center shrink-0 text-primary group-hover:scale-105 transition-transform">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900 leading-tight">ICU Ambulance</h3>
                <div className="text-[11px] text-gray-500 font-medium">Advanced life support systems</div>
              </div>
            </div>
            
            <div className="w-full h-64 relative bg-gray-50 overflow-hidden border-y border-gray-100/50">
              <img src="/images/services/icu_ambulance.png" alt="ICU Ambulance" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1.5">
                <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] font-medium px-2 py-1 rounded-md shadow-sm">Ventilator</span>
                <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] font-medium px-2 py-1 rounded-md shadow-sm">Monitor</span>
                <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] font-medium px-2 py-1 rounded-md shadow-sm">Medical Staff</span>
              </div>
            </div>

            <div className="p-3.5 flex items-center justify-between bg-white mt-auto">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[18px] font-bold text-primary leading-none tracking-tight">₹4,999</span>
                  <span className="text-gray-400 line-through text-[12px]">₹6,999</span>
                  <span className="bg-green-50 text-primary border border-primary/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">28% OFF</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Base (5km) • After 10km: <span className="font-semibold text-gray-700">₹30/km</span></div>
              </div>
              <a href={`tel:${phone}`} className="bg-primary/10 text-primary h-10 px-5 rounded-xl flex justify-center items-center text-[13px] font-semibold hover:bg-primary hover:text-white transition-all active:scale-95">
                Book
              </a>
            </div>
          </div>

          {/* Card 4 */}
          <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300">
            <div className="p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center shrink-0 text-primary group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-gray-900 leading-tight">Dead Body</h3>
                <div className="text-[11px] text-gray-500 font-medium">Respectful mortuary transport</div>
              </div>
            </div>
            
            <div className="w-full h-64 relative bg-gray-50 overflow-hidden border-y border-gray-100/50">
              <img src="/images/services/mortuary_ambulance.png" alt="Mortuary Ambulance" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1.5">
                <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] font-medium px-2 py-1 rounded-md shadow-sm">Freezer Box</span>
                <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] font-medium px-2 py-1 rounded-md shadow-sm">Safe Handling</span>
                <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] font-medium px-2 py-1 rounded-md shadow-sm">Doorstep</span>
              </div>
            </div>

            <div className="p-3.5 flex items-center justify-between bg-white mt-auto">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[18px] font-bold text-gray-900 leading-none">₹1,799</span>
                  <span className="text-gray-400 line-through text-[12px]">₹2,499</span>
                  <span className="bg-green-50 text-primary border border-primary/20 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">28% OFF</span>
                </div>
                <div className="text-[10px] text-gray-500 mt-1">Base (5km) • After 10km: <span className="font-semibold text-gray-700">₹20/km</span></div>
              </div>
              <a href={`tel:${phone}`} className="bg-primary/10 text-primary h-10 px-5 rounded-xl flex justify-center items-center text-[13px] font-semibold hover:bg-primary hover:text-white transition-all active:scale-95">
                Book
              </a>
            </div>
          </div>

        </div>

        {/* Extra Charges */}
        <div className="mt-10 bg-gray-50 rounded-2xl p-6 border border-gray-100 max-w-4xl mx-auto">
          <h4 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2 justify-center sm:justify-start">
            <Clock className="w-5 h-5 text-primary" /> Extra Charges
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center sm:text-left">
              <div className="text-sm text-gray-500 mb-1">Night Charges (10 PM – 6 AM)</div>
              <div className="font-bold text-gray-900 text-lg">+₹300 – ₹500</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center sm:text-left">
              <div className="text-sm text-gray-500 mb-1">Urgent Booking</div>
              <div className="font-bold text-gray-900 text-lg">+₹200</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center sm:text-left">
              <div className="text-sm text-gray-500 mb-1">Waiting Charges</div>
              <div className="font-bold text-gray-900 text-lg">₹100 / 15 min</div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-light text-primary font-bold px-6 py-3 rounded-full text-sm sm:text-base border border-primary/20">
            <Shield className="w-5 h-5 text-primary" /> Starting ₹1,199 – Transparent Pricing | No Hidden Charges
          </div>
        </div>

        {/* Value Additions to Fill Space */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Features */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-primary" /> Why Choose Dr. Jhatka
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">10-15 Min Response Time</h4>
                  <p className="text-sm text-gray-500 mt-0.5">Fastest dispatch system in the city for critical emergencies.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">ICU Trained Staff</h4>
                  <p className="text-sm text-gray-500 mt-0.5">Highly qualified paramedics and nurses for transit care.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">100% Transparent</h4>
                  <p className="text-sm text-gray-500 mt-0.5">No hidden charges or surge pricing during night times.</p>
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Ambulance className="w-6 h-6 text-primary" /> How It Works
            </h3>
            <div className="relative border-l-2 border-primary/20 ml-6 space-y-6">
              <div className="relative pl-8">
                <div className="absolute -left-[17px] top-0.5 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ring-4 ring-gray-50">1</div>
                <h4 className="font-bold text-gray-900">Call or Book Online</h4>
                <p className="text-sm text-gray-500 mt-1">Share your location and patient condition with our dispatcher.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-[17px] top-0.5 w-8 h-8 bg-white border-2 border-primary rounded-full flex items-center justify-center text-primary font-bold text-sm ring-4 ring-gray-50">2</div>
                <h4 className="font-bold text-gray-900">Instant Dispatch</h4>
                <p className="text-sm text-gray-500 mt-1">The nearest fully-equipped ambulance is dispatched immediately.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-[17px] top-0.5 w-8 h-8 bg-white border-2 border-primary rounded-full flex items-center justify-center text-primary font-bold text-sm ring-4 ring-gray-50">3</div>
                <h4 className="font-bold text-gray-900">Safe Hospital Transfer</h4>
                <p className="text-sm text-gray-500 mt-1">Continuous monitoring and expert care during the entire journey.</p>
              </div>
            </div>
            
            <a href={`tel:${phone}`} className="mt-8 w-full bg-primary text-white py-3.5 rounded-xl font-bold flex items-center justify-center hover:bg-primary-dark transition active:scale-95 shadow-md">
              <Phone className="w-5 h-5 mr-2" /> Request Ambulance Now
            </a>
          </div>
        </div>


      </section>

      <FAQSection 
        title="FAQ SECTION – AMBULANCE SERVICE" 
        faqs={[
          { q: "Q1. Ambulance kitni jaldi pahunchti hai?", a: "Dr Jhatka Medicare nearest ambulance ko turant dispatch karta hai. Emergency me 20–30 minutes me pahunchne ki koshish ki jati hai (location dependent)." },
          { q: "Q2. Kya ambulance 24/7 available hai?", a: "Haan, ambulance service 24/7 available hai (subject to availability). Emergency ke liye turant call kare." },
          { q: "Q3. Kaun kaun si ambulance available hai?", a: "Basic, oxygen support aur patient transfer ambulance available hain (availability area ke hisaab se hoti hai)." },
          { q: "Q4. Charges kaise hote hain?", a: "Charges distance aur ambulance type ke hisaab se hote hain. Booking ke time exact charges bataye jate hain." },
          { q: "Q5. Kaise ambulance book kare?", a: "Aap directly call ya WhatsApp karke turant ambulance book kar sakte hain. Hamari team jaldi se arrangement karti hai." }
        ]} 
      />

      <StickyBottomBar />
    </main>
  );
}

// ==================== PHYSIOTHERAPY PAGE ====================
function PhysiotherapyPage() {
  const phone = "919026365448";
  
  return (
    <main className="min-h-screen bg-white pb-20">
      <Navbar />

      {/* Hero Banner - EXACTLY SAME AS OTHERS */}
      <section className="mt-14 relative w-full bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-[300px] sm:h-[300px] w-full">
            <Image
              src="/images/services/physiotherapy.png" // Replace with physio image
              alt="Physiotherapy Services"
              fill
              className="object-cover object-center opacity-90"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="relative z-10 h-full flex items-end px-5 sm:px-8 pb-6 sm:pb-8">
              <h1 className="text-white text-2xl sm:text-3xl font-semibold tracking-wide shadow-sm">
                Physiotherapy Services
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Intro / Positioning (Premium Mobile Style) */}
      <section className="px-5 pt-8 pb-4 max-w-7xl mx-auto">
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-500 font-semibold px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider w-max">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Limited Slots Available Today
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-[1.2] tracking-tight">
            Book Certified Physiotherapist at Home in 30 Minutes
          </h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Expert Care at Home <span className="text-gray-300 mx-1">•</span> Affordable Packages <span className="text-gray-300 mx-1">•</span> Quick Recovery
          </p>
        </div>
      </section>

      {/* Pricing Section (Minimal App Style) */}
      <section className="px-5 py-8 max-w-7xl mx-auto">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Transparent Pricing</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col">
             <div className="absolute top-0 right-0 bg-red-50 text-red-500 font-semibold text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-wider">50% OFF</div>
             <h4 className="font-semibold text-gray-800 text-base">1 Session (Trial)</h4>
             <div className="mt-3 flex items-end gap-2">
               <span className="text-2xl font-bold text-gray-900">₹499</span>
               <span className="text-xs text-gray-400 line-through mb-1.5">₹999</span>
             </div>
             <a href={`tel:${phone}`} className="mt-5 w-full bg-gray-50 text-gray-700 py-3 rounded-xl text-sm font-semibold flex items-center justify-center hover:bg-gray-100 transition active:scale-95">Book Trial</a>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col">
             <div className="absolute top-0 right-0 bg-green-50 text-primary font-semibold text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-wider">Save ₹1000</div>
             <h4 className="font-semibold text-gray-800 text-base">7 Days Package</h4>
             <div className="mt-3 flex items-end gap-2">
               <span className="text-2xl font-bold text-gray-900">₹2999</span>
               <span className="text-xs text-gray-400 line-through mb-1.5">₹3999</span>
             </div>
             <a href={`tel:${phone}`} className="mt-5 w-full bg-gray-50 text-gray-700 py-3 rounded-xl text-sm font-semibold flex items-center justify-center hover:bg-gray-100 transition active:scale-95">Book Package</a>
          </div>

          {/* Card 3 - MOST POPULAR (Soft Highlight) */}
          <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20 shadow-sm relative overflow-hidden flex flex-col sm:col-span-2 lg:col-span-1">
             <div className="absolute top-0 right-0 bg-primary text-white font-semibold text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
               <Star className="w-3 h-3 fill-white" /> Most Popular (Save ₹1500)
             </div>
             <h4 className="font-semibold text-primary text-lg mt-2">15 Days Package</h4>
             <div className="mt-2 flex items-end gap-2">
               <span className="text-3xl font-bold text-gray-900">₹5499</span>
               <span className="text-sm text-gray-400 line-through mb-1.5">₹6999</span>
             </div>
             <p className="text-[11px] text-gray-500 mt-2">Recommended for optimal recovery</p>
             <a href={`tel:${phone}`} className="mt-5 w-full bg-primary text-white py-3.5 rounded-xl text-sm font-bold flex items-center justify-center hover:bg-primary-dark transition active:scale-95 shadow-sm">Book 15 Days Now</a>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col">
             <div className="absolute top-0 right-0 bg-amber-50 text-amber-600 font-semibold text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-wider">Best Value | Save ₹3000</div>
             <h4 className="font-semibold text-gray-800 text-base">30 Days Package</h4>
             <div className="mt-3 flex items-end gap-2">
               <span className="text-2xl font-bold text-gray-900">₹9999</span>
               <span className="text-xs text-gray-400 line-through mb-1.5">₹12999</span>
             </div>
             <a href={`tel:${phone}`} className="mt-5 w-full bg-gray-50 text-gray-700 py-3 rounded-xl text-sm font-semibold flex items-center justify-center hover:bg-gray-100 transition active:scale-95">Book 30 Days</a>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] relative overflow-hidden flex flex-col">
             <div className="absolute top-0 right-0 bg-blue-50 text-blue-600 font-semibold text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-wider">Same Day Service</div>
             <h4 className="font-semibold text-gray-800 text-base">Emergency Visit</h4>
             <div className="mt-3 flex items-end gap-2">
               <span className="text-2xl font-bold text-gray-900">₹799</span>
               <span className="text-xs text-gray-400 line-through mb-1.5">₹1499</span>
             </div>
             <a href={`tel:${phone}`} className="mt-5 w-full bg-gray-50 text-gray-700 py-3 rounded-xl text-sm font-semibold flex items-center justify-center hover:bg-gray-100 transition active:scale-95">Request Emergency</a>
          </div>
        </div>
      </section>

      {/* Problem-Based Sections */}
      <section className="px-5 py-8 max-w-7xl mx-auto">
        <h3 className="text-lg font-bold text-gray-900 mb-6">What We Treat</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { title: "Back Pain Treatment", icon: Activity },
            { title: "Knee Pain Therapy", icon: Accessibility },
            { title: "Paralysis / Stroke", icon: Brain },
            { title: "Post Surgery", icon: Clock },
            { title: "Frozen Shoulder", icon: CheckCircle2 }
          ].map((problem) => (
            <div key={problem.title} className="bg-white border border-gray-100 rounded-2xl p-4 text-center flex flex-col items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="w-10 h-10 bg-primary-light/50 text-primary rounded-full flex items-center justify-center">
                <problem.icon className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-gray-800 text-xs sm:text-sm">{problem.title}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Location Section */}
      <section className="px-5 py-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 p-5 sm:p-6 border-l-4 border-l-primary">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Serving Lucknow | Expanding Soon
          </h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Active Service Areas
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-primary text-white px-3.5 py-1.5 rounded-full font-medium shadow-sm cursor-default">
                  Lucknow (All Areas)
                </span>
              </div>
            </div>

            <div className="pt-5 border-t border-gray-100">
              <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                Coming Soon
              </h4>
              <div className="flex flex-wrap gap-2">
                {["Kanpur", "Barabanki", "Sitapur", "Raebareli", "Unnao", "Ayodhya"].map((city) => (
                  <span key={city} className="text-xs bg-gray-50 text-gray-500 border border-gray-200 px-3.5 py-1.5 rounded-full font-medium cursor-default">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Elements */}
      <section className="px-5 py-10 max-w-7xl mx-auto">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Patient Reviews</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "Rahul S.", review: "Very professional. My father's knee pain improved significantly.", rating: 5 },
            { name: "Meera K.", review: "Excellent post-surgery rehab at home. Guided me perfectly.", rating: 5 },
            { name: "Vikas T.", review: "Highly recommended for frozen shoulder. Transparent pricing.", rating: 5 }
          ].map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
              <div className="flex gap-1 mb-3 text-[#FFD700]">
                {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed">"{r.review}"</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary-light rounded-full flex items-center justify-center text-primary text-xs font-bold">
                  {r.name.charAt(0)}
                </div>
                <h4 className="font-semibold text-gray-900 text-xs">{r.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      <FAQSection 
        title="FAQ SECTION – PHYSIOTHERAPY AT HOME" 
        faqs={[
          { q: "Q1. Physiotherapy session ghar par kaise hota hai?", a: "Hamare trained physiotherapist aapke ghar par aakar proper assessment karke treatment start karte hain. Exercises, pain relief therapy aur guidance sab ghar par hi diya jata hai." },
          { q: "Q2. Physiotherapy kitne din tak karni padti hai?", a: "Condition ke hisaab se duration decide hota hai. Normally 7, 15 ya 30 days packages available hote hain. Therapist aapko best plan suggest karta hai." },
          { q: "Q3. Kya ek session me hi relief mil jata hai?", a: "Kuch cases me first session me relief milta hai, lekin long-term result ke liye multiple sessions recommended hote hain." },
          { q: "Q4. Kya physiotherapy safe hai?", a: "Haan, physiotherapy ek safe aur non-surgical treatment hai. Hamare experienced therapists proper techniques follow karte hain." },
          { q: "Q5. Kya physiotherapist ghar par equipment lekar aata hai?", a: "Haan, basic required equipment therapist saath me lekar aata hai. Advanced equipment condition ke hisaab se arrange kiya jata hai." },
          { q: "Q6. Kis type ke patients ke liye physiotherapy useful hai?", a: "Back pain, neck pain, knee pain, paralysis, post-surgery recovery, sports injury aur elderly care me physiotherapy bahut effective hoti hai." },
          { q: "Q7. Charges kya hote hain?", a: "Physiotherapy charges package ke hisaab se hote hain: 1 Session, 7 Days, 15 Days aur 30 Days packages available hain (best value plans bhi available hain)." },
          { q: "Q8. Kya same day physiotherapy possible hai?", a: "Haan, same day physiotherapy home visit available hai (subject to availability)." },
          { q: "Q9. Kya female physiotherapist available hai?", a: "Haan, female physiotherapist option bhi available hai (on request)." },
          { q: "Q10. Kaise booking kare?", a: "Aap call ya WhatsApp ke through easily booking kar sakte hain. Hamari team turant therapist assign karegi." }
        ]} 
      />

      <StickyBottomBar />
    </main>
  );
}

// ==================== MAIN PAGE ====================
export default async function ServicePage({ params }) {
  const { slug } = await params; // ✅ FIX
  
  if (slug === "ambulance") {
    return <AmbulancePage />;
  }

  if (slug === "physiotherapy") {
    return <PhysiotherapyPage />;
  }

  const service = SERVICES_CONFIG[slug];

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white pb-24 sm:pb-8">
      <Navbar />
      <Banner config={service.banner} />
      <ServiceTypes types={service.types} />
      <Benefits benefits={service.benefits} />
      <Packages packages={service.packages} />
      <ServiceAreas areas={service.serviceAreas} />
      <BookingForm config={service} />
      <Testimonials testimonials={service.testimonials} />
      <StickyBottomBar />
    </main>
  );
}

// // Optional: Generate static params for all services
// export async function generateStaticParams() {
//   return Object.keys(SERVICES_CONFIG).map((slug) => ({ slug }));
// }
