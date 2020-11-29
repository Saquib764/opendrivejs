import React, { useEffect, useState, useRef } from 'react';
// import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import './index.scss';

import Page from '../../component/Page';
import API from '../../API';
import {THREE} from '../../util/three'
import xml2js from 'xml2js'
import OpenDrive from '../../opendrivejs'

const Scenario = () => {
    const mount = useRef(null)
    const [isAnimating, setAnimating] = useState(true)
    const controls = useRef(null)
    const [Scene, setScene] = useState(null)

    useEffect(() => {
        setup()
    }, [])

    function add_light(_scene) {
        var light = new THREE.AmbientLight( 0x404040 ); // soft white light
        _scene.add( light );

        var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        hemiLight.position.set( 0, 0, 4 );
        _scene.add( hemiLight );
    }
    function setup() {

        let width = mount.current.clientWidth
        let height = mount.current.clientHeight
        let frameId

        let isMouseDown = false

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100000)
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
        const cube = new THREE.Mesh(geometry, material)

        camera.position.z = 4;
        camera.position.y = 0;
        camera.position.x = -5;
        camera.rotation.z = - Math.PI/2
        camera.rotation.y = - Math.PI/2 + Math.PI/8
        window.camera = camera

        const size = 100;
        const divisions = 100;

        const gridHelper = new THREE.GridHelper( size, divisions );
        gridHelper.rotation.x = Math.PI/2
        scene.add( gridHelper );

        add_light(scene)
        // scene.add(cube)
        renderer.setClearColor('#ccccff')
        renderer.setSize(width, height)

        setScene(scene)

        const renderScene = () => {
          renderer.render(scene, camera)
        }

        const handleResize = () => {
          width = mount.current.clientWidth
          height = mount.current.clientHeight
          renderer.setSize(width, height)
          camera.aspect = width / height
          camera.updateProjectionMatrix()
          renderScene()
        }
        const handleMousemove = (evt) => {
          if(!isMouseDown) return
          camera.position.x += evt.movementY/50
          camera.position.y += evt.movementX/50
        }
        const handleMousedown = (evt) => {
          isMouseDown = true
        }
        const handleMouseup = (evt) => {
          isMouseDown = false
        }
        let theta = 0
    
        const animate = () => {
          // theta += 0.01
          // let tt = Math.sin(theta)
          // camera.position.y = 3*Math.sin(tt)

          renderScene()
          frameId = window.requestAnimationFrame(animate)
        }

        const start = () => {
          if (!frameId) {
            frameId = requestAnimationFrame(animate)
          }
        }

        const stop = () => {
          cancelAnimationFrame(frameId)
          frameId = null
        }

        mount.current.appendChild(renderer.domElement)
        window.addEventListener('resize', handleResize)
        window.addEventListener('mousemove', handleMousemove)
        window.addEventListener('mousedown', handleMousedown)
        window.addEventListener('mouseup', handleMouseup)
        start()
        // renderScene()

        controls.current = { start, stop }

        return () => {
          stop()
          window.removeEventListener('resize', handleResize)
          window.removeEventListener('mousemove', handleMousemove)
          window.removeEventListener('mousedown', handleMousedown)
          window.removeEventListener('mouseup', handleMouseup)
          mount.current.removeChild(renderer.domElement)

          scene.remove(cube)
          geometry.dispose()
          material.dispose()
        }

    }
    async function load_opendrive() {
        const xodr_xml = (await API.get_opendrive_file('Simple_LaneOffset')).replace(/(\r\n|\n|\r)/gm, "");

        const xodr_json = await xml2js.parseStringPromise(xodr_xml, { mergeAttrs: true });
        let xodr_supported = new OpenDrive(xodr_json)
        xodr_supported.render(THREE, Scene)
        // xodr_supported.road[0].render(Scene)

        // console.log(xodr_supported.road[0].lanes)
    }

    useEffect(()=>{
        if(! Scene) return
        load_opendrive()
      }, [Scene])

    return (
        <Page className='no-padding'>
            <div className='three-mount' ref={mount}> </div>
        </Page>
    )
}

export default Scenario