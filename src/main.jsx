import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

import './index.css'

import ErrorPage404 from './error-page-404';

import {
	createBrowserRouter,
	RouterProvider,
} from 'react-router-dom';

import Home, {
	loader as rootLoader,
	action as rootAction
} from './components/home/Home';

import Trip, {
	loader as tripLoader,
	action as tripAction,
} from './components/trip/Trip';

import EditTrip, {
	loader as editTripLoader,
	action as editTripAction,
} from './components/editTrip/EditTrip';

import ShowNote, {
	loader as showNoteLoader,
} from './components/showNote/ShowNote';

import EditNote, {
	loader as editNoteLoader,
	action as editNoteAction,
} from './components/editNote/EditNote';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        loader: rootLoader,
        action: rootAction,
    },
    {
        path: '/trips/:tripId',
        element: <Trip />,
        loader: tripLoader,
        action: tripAction,
    },
    {
        path: '/trips/:tripId/edit',
        element: <EditTrip />,
        loader: editTripLoader,
        action: editTripAction,
    },
    {
        path: '/trips/:tripId/:noteId',
        element: <ShowNote />,
        loader: showNoteLoader,
    },
    {
        path: '/trips/:tripId/:noteId/edit',
        element: <EditNote />,
        loader: editNoteLoader,
        action: editNoteAction,
    },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
