import {Component, OnDestroy, OnInit} from '@angular/core';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import {Router} from '@angular/router';
import {UserService} from '../auth/user.service';
import Toast from 'bootstrap/js/dist/toast';
import {DataStorageService} from '../shared/data-storage.service';

import {environment} from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private map;
  private geoLocate;
  isAuthenticated: boolean = false;
  private location;
  citySuggestions: string[] = [];
  private suggestions;

  private centerCoords = {
    'akola': [77.0082, 20.7002],
    'ahmednagar': [74.7480, 19.0948],
    'amravati': [77.7523, 20.9320],
    'aurangabad': [75.3433, 19.8762],
    'beed': [75.7531, 18.9901],
    'bhandara': [79.6570, 21.1777],
    'chandrapur': [79.2961, 19.9615],
    'gondia': [80.1961, 21.4549],
    'ichalkaranji': [74.4593, 16.6886],
    'jalgaon': [75.5626, 21.0077],
    'jalna': [75.8816, 19.8347],
    'karad': [74.1844, 17.2777],
    'kolhapur': [74.2433, 16.7050],
    'latur': [76.5604, 18.4088],
    'mumbai': [72.8777, 19.0760],
    'malegaon': [74.5089, 20.5579],
    'miraj': [74.6509, 16.8222],
    'nagpur': [79.0882, 21.1458],
    'nashik': [73.7898, 19.9975],
    'nanded': [77.3210, 19.1383],
    'parbhani': [76.7748, 19.2608],
    'pune': [73.8567, 18.5204],
    'ratnagiri': [73.3120, 16.9902],
    'sangli': [74.5815, 16.8524],
    'satara': [74.0183, 17.6805],
    'solapur': [75.9064, 17.6599],
    'wardha': [78.6022, 20.7453],
    'yavatmal': [78.1307, 20.3899],
  };

  constructor(private router: Router, private userService: UserService, private dataStorageService: DataStorageService) {
  }

  ngOnInit(): void {

    this.userService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });

    mapboxgl.accessToken = environment.MAPBOX_TOKEN;
    const map = this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [76.33355396887072, 19.27731617687001],
      zoom: 5.7
    });

    this.geoLocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showAccuracyCircle: false
    });

    map.addControl(this.geoLocate);

    map.on('load', () => {
      map.loadImage(
        ' ../../assets/images/icons/marker.png',
        (error, image) => {
          if (error) {
            throw error;
          }
          map.addImage('custom-marker', image);

          map.addSource('restaurants', {
            type: 'geojson',
            data: environment.SERVER_URL + 'mapData',
            cluster: true,
            clusterMaxZoom: 12,
            clusterRadius: 50
          });

          map.addLayer({
            id: 'clusters',
            type: 'circle',
            source: 'restaurants',
            filter: ['has', 'point_count'],
            paint: {

              'circle-color': [
                'step',
                ['get', 'point_count'],
                '#2f6d73',
                4,
                '#ea8a8a',
                5,
                '#867ae9',
                9,
                '#fce38a',
                10,
                '#e4eddb'
              ],
              'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                5,
                25,
                10,
                35
              ]
            }
          });

          map.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'restaurants',
            filter: ['has', 'point_count'],
            layout: {
              'text-field': '{point_count_abbreviated}',
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12
            }
          });

          map.addLayer({
            id: 'unclustered-point',
            type: 'symbol',
            source: 'restaurants',
            filter: ['!', ['has', 'point_count']],
            layout: {
              'icon-image': 'custom-marker',
              'icon-allow-overlap': true,
            }
          });

          map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');


          map.on('click', 'clusters', (e) => {
            const features = map.queryRenderedFeatures(e.point, {
              layers: ['clusters']
            });
            const clusterId = features[0].properties.cluster_id;
            map.getSource('restaurants').getClusterExpansionZoom(
              clusterId,
              function(err, zoom) {
                if (err) {
                  return;
                }

                map.easeTo({
                  center: features[0].geometry.coordinates,
                  zoom: zoom
                });
              }
            );
          });

          map.on('click', 'unclustered-point', (e) => {
            let {restaurant, city} = e.features[0].properties;

            restaurant = restaurant.replace(/ /g, '-');
            this.router.navigate([city, restaurant]);
          });

          map.on('mouseenter', 'clusters', function() {
            map.getCanvas().style.cursor = 'pointer';
          });
          map.on('mouseleave', 'clusters', function() {
            map.getCanvas().style.cursor = '';
          });

          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            closeOnMove: true,
            anchor: 'left'
          });

          map.on('mouseenter', 'unclustered-point', e => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const {popUpMarkup} = e.features[0].properties;

            map.getCanvas().style.cursor = 'pointer';

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            popup.setLngLat(coordinates).setHTML(popUpMarkup).addTo(map);
          });

          map.on('mouseleave', 'unclustered-point', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
          });
        });


    });

    this.location = document.getElementById('location') as HTMLElement;
    this.suggestions = document.getElementById('suggestions') as HTMLElement;

    document.addEventListener('click', () => {
      this.suggestions.style.display = 'none';
    });

    this.location.addEventListener('input', e => {
      if (e.target.value.trim().length > 0) {
        this.citySuggestions = this.dataStorageService.getCitySuggestion(e.target.value.trim().toLowerCase());
        this.map.flyTo({
          center: this.centerCoords[this.citySuggestions[0]],
          zoom: 11,
          essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
      } else {
        this.citySuggestions = [];
      }
    });

    this.location.addEventListener('click', e => {
      e.stopPropagation();
    });

    this.location.addEventListener('focus', () => {
      this.suggestions.style.display = 'block';
    });

    this.suggestions.addEventListener('click', (e) => {
      e.stopPropagation();
    });

  }

  onLocate() {
    const myToast = new Toast(document.getElementById('liveToast'));
    myToast.show();
    this.geoLocate.trigger();
  }

  onFindFood() {
    this.router.navigate([this.location.value]);
  }

  ngOnDestroy() {
    this.location.removeEventListener('input', () => {
    });
  }
}

