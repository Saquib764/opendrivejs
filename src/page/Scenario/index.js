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

    useEffect(() => {
        setup()
        load_opendrive()
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

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: 0xff00ff })
        const cube = new THREE.Mesh(geometry, material)

        camera.position.z = 4
        add_light(scene)
        scene.add(cube)
        renderer.setClearColor('#ccccff')
        renderer.setSize(width, height)


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
    
        const animate = () => {
          cube.rotation.x += 0.01
          cube.rotation.y += 0.01

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
        start()

        controls.current = { start, stop }
        
        return () => {
          stop()
          window.removeEventListener('resize', handleResize)
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

        console.log(xodr_supported)
    }

    useEffect(() => {
        if (isAnimating) {
            controls.current.start()
        } else {
            controls.current.stop()
        }
    }, [isAnimating])

    return (
        <Page className='no-padding'>
            <div className='three-mount' ref={mount} onClick={() => setAnimating(!isAnimating)}> </div>
        </Page>
    )
}

export default Scenario