import { atom, useAtom } from 'jotai';

export const API_KEY = 'dea8529e-6700-47c0-80d7-3204195eb0d5'
export const ServerUrl = 'http://192.168.8.123:7144';

export const signedIn = atom(false);
export const role = atom('Clients')

export const userDirector = atom(false)
export const userEmployee = atom(false)

export const DepId = atom()

export const taskId = atom()
export const taskInfo = atom()

export const token = atom()
