import type { ArchitectureCategoryMeta, ArchitectureStyle } from '../types/architectureStyle'

export const ARCHITECTURE_CATEGORIES: ArchitectureCategoryMeta[] = [
  { key: 'monolithic', label: 'Monolithiques & en couches' },
  { key: 'distributed', label: 'Distribuées' },
  { key: 'domain-centric', label: 'Centrées sur le domaine' },
  { key: 'event-driven', label: 'Pilotées par les événements' },
]

export const ARCHITECTURE_STYLES: ArchitectureStyle[] = [
  {
    id: 'monolithic',
    category: 'monolithic',
    title: 'Monolithique',
    definition:
      "Toute l'application (UI, logique métier, accès aux données) est développée, testée et déployée comme une seule unité exécutable, partageant un seul processus et souvent une seule base de données.",
    whenToUse:
      "Une équipe unique, un domaine métier pas encore stabilisé, ou un besoin de livrer vite sans la complexité opérationnelle d'un système distribué — la majorité des projets devraient commencer ainsi.",
    lang: 'java',
    code: `// Une seule unité de déploiement (un seul .jar)
com.example.app/
  controller/   // REST endpoints
  service/      // logique métier
  repository/   // accès aux données
  model/        // entités JPA
// Un seul processus, une seule base de données partagée`,
    tradeoff:
      "Simple à développer et déployer au début, mais devient difficile à faire évoluer et à scaler sélectivement à mesure que l'équipe et le code grandissent — le couplage interne rend les déploiements de plus en plus risqués.",
  },
  {
    id: 'layered',
    category: 'monolithic',
    title: 'Architecture en couches (Layered / N-tier)',
    definition:
      "Organise le code en couches horizontales empilées (présentation, métier, accès aux données), chaque couche ne communiquant qu'avec la couche immédiatement en dessous.",
    whenToUse:
      "Structurer un monolithe de façon lisible et testable, en séparant clairement les responsabilités techniques, sans viser une architecture distribuée.",
    lang: 'java',
    code: `@RestController          // Couche présentation
class ReservationController {
    private final ReservationService service; // ne connaît que la couche métier
}

@Service                 // Couche métier
class ReservationService {
    private final ReservationRepository repository; // ne connaît que l'accès aux données
}

interface ReservationRepository extends JpaRepository<Reservation, Long> {} // Couche données`,
    tradeoff:
      "Facile à comprendre et à onboarder, mais le risque est de laisser la couche de présentation ou d'accès aux données contaminer la couche métier si la discipline de séparation n'est pas maintenue (ex. un Controller qui appelle directement un Repository).",
  },
  {
    id: 'modulith',
    category: 'monolithic',
    title: 'Modulith (monolithe modulaire)',
    definition:
      "Un monolithe déployé comme une seule unité, mais découpé en interne en modules fortement encapsulés avec des frontières explicites, chacun exposant une API interne claire.",
    whenToUse:
      "Bénéficier de la clarté de frontières des microservices (un module = un domaine métier) sans payer le coût opérationnel de la distribution — souvent une étape intermédiaire avant d'éventuellement extraire de vrais microservices si le besoin se confirme.",
    lang: 'java',
    code: `@ApplicationModule // Spring Modulith : déclare une frontière de module explicite
package com.example.app.billing;

// Le module 'booking' ne peut accéder à 'billing' que via son API publique,
// jamais via ses classes internes — vérifié automatiquement par des tests d'architecture.`,
    tradeoff:
      "Nécessite une discipline stricte (souvent outillée, ex. Spring Modulith) pour empêcher les modules de s'appeler n'importe comment ; sans cet outillage, la frontière entre modules s'érode avec le temps.",
  },
  {
    id: 'microservices',
    category: 'distributed',
    title: 'Microservices',
    definition:
      "Découpe l'application en services indépendants, chacun responsable d'un domaine métier précis, déployables et scalables séparément, communiquant via le réseau.",
    whenToUse:
      "Plusieurs équipes autonomes, des besoins de scalabilité très différents selon les domaines, ou une organisation déjà mature en observabilité et déploiement automatisé.",
    lang: 'java',
    code: `// Service Booking (déploiement indépendant)
@RestController
class BookingController { /* ... */ }

// Service Payment (déploiement indépendant, sa propre base de données)
@RestController
class PaymentController { /* ... */ }

// Communication via HTTP/gRPC ou messages, jamais d'appel direct en mémoire`,
    tradeoff:
      "Scalabilité et autonomie d'équipe accrues, au prix d'une complexité opérationnelle bien plus grande : réseau, cohérence des données entre services (souvent finale plutôt qu'immédiate), observabilité distribuée.",
  },
  {
    id: 'soa',
    category: 'distributed',
    title: 'SOA (architecture orientée services)',
    definition:
      "Précurseur des microservices : expose des fonctionnalités métier comme des services réutilisables, souvent orchestrés via un bus de services d'entreprise (ESB) centralisé.",
    whenToUse:
      "Grandes organisations avec de nombreux systèmes hérités à intégrer, où un bus centralisé facilite l'interopérabilité entre technologies très hétérogènes.",
    lang: 'java',
    code: `// Contrat de service exposé (souvent SOAP/WSDL historiquement, REST aujourd'hui)
interface CustomerService {
    CustomerDetails getCustomer(String customerId);
}
// Orchestré et routé via un bus de services d'entreprise (ESB) centralisé`,
    tradeoff:
      "Le bus centralisé (ESB) devient souvent lui-même un goulot d'étranglement et un point de couplage fort, ce qui a motivé le mouvement microservices vers une communication plus décentralisée.",
  },
  {
    id: 'serverless',
    category: 'distributed',
    title: 'Serverless (FaaS)',
    definition:
      "Le code métier est déployé comme des fonctions individuelles, exécutées à la demande par le fournisseur cloud, sans gestion explicite de serveur ni de processus qui tourne en continu.",
    whenToUse:
      "Charges de travail événementielles et irrégulières (traitement de fichier uploadé, webhook), où payer uniquement à l'exécution réelle est plus économique qu'un serveur qui tourne 24/7.",
    lang: 'java',
    code: `// Une fonction déployée indépendamment, invoquée par un événement (ex. upload S3)
public class ResizeImageFunction implements RequestHandler<S3Event, String> {
    public String handleRequest(S3Event event, Context context) {
        // traite un seul événement, puis l'infrastructure est libérée
        return "OK";
    }
}`,
    tradeoff:
      "Élimine la gestion d'infrastructure, mais introduit un cold start (latence au premier appel après inactivité) et un risque de dépendance forte au fournisseur cloud (vendor lock-in).",
  },
  {
    id: 'client-server',
    category: 'distributed',
    title: 'Client-Serveur',
    definition:
      "Sépare les responsabilités entre un client qui envoie des requêtes et un serveur qui centralise les données et la logique métier pour y répondre.",
    whenToUse:
      "Le modèle de base de la quasi-totalité des applications web — pertinent de le nommer explicitement pour discuter ensuite de ses variantes (2-tier, 3-tier, N-tier).",
    lang: 'java',
    code: `// Client (React) : envoie la requête, affiche la réponse
fetch('/api/reservations').then(r => r.json());

// Serveur (Spring) : centralise la logique et les données
@GetMapping("/api/reservations")
List<ReservationDto> list() { return service.findAll(); }`,
    tradeoff:
      "Simple et bien compris, mais un client trop riche en logique métier (fat client) recrée les problèmes qu'on cherche à éviter en centralisant cette logique côté serveur.",
  },
  {
    id: 'hexagonal',
    category: 'domain-centric',
    title: 'Architecture hexagonale (Ports & Adapters)',
    definition:
      "Isole le cœur métier (domaine) du monde extérieur via des ports (interfaces définies par le domaine) et des adaptateurs (implémentations techniques qui les respectent).",
    whenToUse:
      "Protéger une logique métier riche et durable des détails techniques volatils (choix de base de données, framework web), pour pouvoir les faire évoluer indépendamment.",
    lang: 'java',
    code: `// Port : défini par le domaine, sans dépendance technique
interface NotificationSender {
    void send(String to, String message);
}

// Adaptateur : implémentation technique concrète, dans la couche infrastructure
class EmailNotificationSender implements NotificationSender {
    public void send(String to, String message) { /* appel SMTP */ }
}
// Le domaine dépend de l'interface NotificationSender, jamais de EmailNotificationSender directement`,
    tradeoff:
      "Ajoute une indirection réelle (interfaces, mapping) qui ne se justifie que si le domaine métier est suffisamment riche pour valoir cette protection — inutile pour un simple CRUD sans règle métier notable.",
  },
  {
    id: 'clean-architecture',
    category: 'domain-centric',
    title: 'Clean Architecture (Onion)',
    definition:
      "Organise le code en cercles concentriques où les dépendances ne pointent que vers l'intérieur : le domaine au centre ne dépend de rien, l'infrastructure en périphérie dépend du domaine.",
    whenToUse:
      "Même objectif que l'architecture hexagonale (protéger le domaine), avec une structuration plus explicite en couches concentriques (entités, cas d'usage, interfaces, frameworks).",
    lang: 'java',
    code: `// Centre : entité de domaine, aucune dépendance technique
class Reservation { /* règles métier pures */ }

// Cas d'usage : orchestre le domaine, dépend d'interfaces (ports) uniquement
class CreateReservationUseCase {
    private final ReservationRepository repository; // interface, pas une implémentation JPA
}
// Périphérie : Spring, JPA, contrôleurs REST — dépendent du centre, jamais l'inverse`,
    tradeoff:
      "Proche de l'architecture hexagonale dans l'esprit ; le risque commun aux deux est de sur-architecturer un projet simple avec des couches qui n'apportent aucune protection réelle faute de logique métier complexe à isoler.",
  },
  {
    id: 'event-driven',
    category: 'event-driven',
    title: 'Event-Driven Architecture (EDA)',
    definition:
      "Les composants communiquent en publiant et en consommant des événements de façon asynchrone, plutôt que par des appels directs synchrones.",
    whenToUse:
      "Découpler fortement des services qui réagissent à des faits métier (une réservation créée) sans que le producteur ait besoin de connaître ses consommateurs.",
    lang: 'java',
    code: `// Producteur : publie un fait, sans savoir qui l'écoute
kafkaTemplate.send("reservation-events", new ReservationCreatedEvent(reservation));

// Consommateur(s) indépendant(s), potentiellement dans d'autres services
@KafkaListener(topics = "reservation-events")
void onReservationCreated(ReservationCreatedEvent event) { /* ... */ }`,
    tradeoff:
      "Favorise un découplage fort et une bonne scalabilité, mais rend le flux global du système moins évident à suivre (pas de call stack unique) et introduit une cohérence éventuelle entre les services.",
  },
  {
    id: 'event-sourcing',
    category: 'event-driven',
    title: 'Event Sourcing',
    definition:
      "Au lieu de stocker uniquement l'état courant d'une entité, on stocke la séquence complète des événements qui ont mené à cet état ; l'état actuel se reconstruit en rejouant ces événements.",
    whenToUse:
      "Un besoin fort d'auditabilité (savoir exactement ce qui s'est passé et quand) ou de reconstruire un état passé, typique de la facturation ou de la conformité réglementaire.",
    lang: 'java',
    code: `// On stocke la séquence d'événements, pas l'état final
List<Event> history = List.of(
    new ReservationCreated(id, dates),
    new ReservationDatesChanged(id, newDates),
    new ReservationConfirmed(id)
);
// L'état courant se reconstruit en rejouant ces événements dans l'ordre
Reservation current = history.stream().reduce(Reservation.empty(), Reservation::apply, (a, b) -> b);`,
    tradeoff:
      "Offre un historique complet et immuable, mais complexifie fortement les lectures (souvent besoin d'une projection dénormalisée à côté, cf. CQRS) et la gestion de l'évolution du format des événements dans le temps.",
  },
  {
    id: 'message-driven',
    category: 'event-driven',
    title: 'Message-Driven / Pub-Sub',
    definition:
      "Les composants échangent des messages via un intermédiaire (broker) selon un modèle publish/subscribe, sans connexion directe entre l'émetteur et le ou les récepteurs.",
    whenToUse:
      "Diffuser une information à plusieurs consommateurs intéressés (topic) sans que l'émetteur ait à connaître leur nombre ni leur identité, ou lisser une charge via une file d'attente.",
    lang: 'java',
    code: `// Publisher : envoie sur un topic, sans connaître les abonnés
rabbitTemplate.convertAndSend("booking.exchange", "booking.created", booking);

// Subscriber(s) : chacun reçoit sa propre copie du message
@RabbitListener(queues = "email-service.booking.created")
void handleBookingCreated(Booking booking) { /* ... */ }`,
    tradeoff:
      "Proche de l'Event-Driven Architecture dans la mécanique (un broker au centre), mais met l'accent sur le TRANSPORT du message plutôt que sur la sémantique métier de l'événement — les deux se combinent souvent en pratique.",
  },
]
